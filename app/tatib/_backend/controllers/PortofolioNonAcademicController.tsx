import { Elysia } from "elysia";
import { guardedUserAuthed, LoadUserAuthed } from "@/externals/utils/backend/src/auth-midleware";
import puppeteer from 'puppeteer-core'
import { Launcher } from "chrome-launcher"
import PortofolioNonAcademic from "../../panel/portofolio-non-akademik/_pdf/PortofolioNonAcademic";
import { sutando } from "sutando";
import { stringToArray } from "@/externals/utils/general";
import dayjs from "dayjs";


const PortofolioNonAcademicController = new Elysia()
  .use(LoadUserAuthed)
  .group('/portofolio-non-academic', (group) => (group.guard({ beforeHandle: guardedUserAuthed }, (app) => {


    app.get('/pdf/download', async ({ set, query }) => {
      // Init var
      const { school_years, semester, class_ids, user_ids, just_html } = query

      // Load data student
      const qbStudent = sutando.connection('datainduk').table('students AS s')
        // .leftJoin('student_parents AS sp', 's.user_id', 'sp.student_x_user_id')
        // .leftJoin('parents AS p', (qb) => qb.on('p.user_id', 'sp.parent_x_user_id').onVal('p.type', 'Ayah'))
        .leftJoin((qb) => (qb
          .table('student_parents AS sp')
          .join('parents AS p', (qb) => qb.on('p.user_id', 'sp.parent_x_user_id').onVal('p.type', 'Ayah'))
          .select('sp.student_x_user_id', sutando.connection('datainduk').raw('MAX(p.name) AS name'))
          .groupBy('sp.student_x_user_id')
          .as('sp')
        ), 's.user_id', 'sp.student_x_user_id')
        .leftJoin('student_addresses AS sa', (qb) => qb.on('s.user_id', 'sa.student_x_user_id').andOnVal('sa.is_primary_address', true))
        .join('student_classes AS sc', 'sc.student_x_user_id', 's.user_id')
        .join('view_data_classes AS vdc', 'vdc.class_id', 'sc.class_id')
        .join('school_years AS sy', 'sy.year', 'vdc.school_year')
        .select(
          's.name',
          's.nisn',
          's.nis',
          's.user_id',
          'sp.name AS parent_name',
          'sa.address',
          'sa.rt',
          'sa.rw',
          'sa.hamlet',
          'sa.village',
          'sa.subdistrict',
          'sa.city',
          'vdc.expertise_name',
          'vdc.expertise_short_name',
          'vdc.class_roman_level',
          'vdc.class_alphabet',
          'vdc.school_year',
          'sy.start_date_semester_1',
          'sy.end_date_semester_1',
          'sy.start_date_semester_2',
          'sy.end_date_semester_2',
        )
        .orderBy('vdc.class_full_name')
        .orderBy('s.nis');
      if (school_years) qbStudent.whereIn('vdc.school_year', stringToArray(school_years, Number));
      if (class_ids) qbStudent.whereIn('sc.class_id', stringToArray(class_ids, Number));
      if (user_ids) qbStudent.whereIn('s.user_id', stringToArray(user_ids, Number));
      const students = await qbStudent.get();
      const studentUserIds = students.map((s) => s.user_id).filter(Boolean);
      // return students;

      // Get date range
      let lowestStartDate, greatestStartDate;
      if (semester == '2') {
        lowestStartDate = dayjs.unix(Math.max(...students.map((s) => s.start_date_semester_2).filter(Boolean))).format('DD-MM-YYYY');
        greatestStartDate = dayjs.unix(Math.min(...students.map((s) => s.end_date_semester_2).filter(Boolean))).format('DD-MM-YYYY');
      } else {
        lowestStartDate = dayjs.unix(Math.max(...students.map((s) => s.start_date_semester_1).filter(Boolean))).format('DD-MM-YYYY');
        greatestStartDate = dayjs.unix(Math.min(...students.map((s) => s.end_date_semester_1).filter(Boolean))).format('DD-MM-YYYY');
      }

      // Load data attendance
      const qbAttendance = sutando.connection('absensi').table('daily_attendance_recaps')
        .whereIn('student_x_user_id', studentUserIds)
        .whereIn('school_year', students.reduce((result, s) => {
          if (!result.includes(s.school_year)) result.push(s.school_year);
          return result;
        }, []));
      if (semester) qbAttendance.where('semester', semester);
      const attendances = await qbAttendance.get();

      // Load data violation
      const violations = await sutando.connection('tatib').table('student_violations')
        .whereIn('student_x_user_id', studentUserIds)
        .where('date', '>', lowestStartDate)
        .where('date', '<=', greatestStartDate)
        .get();

      // Load data achievement
      const achievements = await sutando.connection('tatib').table('student_achievements')
        .whereIn('student_x_user_id', studentUserIds)
        .where('date', '>', lowestStartDate)
        .where('date', '<=', greatestStartDate)
        .get();

      // Compiling data
      const raports: any[] = [];
      for (const student of students) {
        const isValidSemester = [1, 2].includes(Number(semester));

        const currenrSemester = isValidSemester ? Number(semester) : 1;
        const dateStartSemester = dayjs.unix(student[`start_date_semester_${currenrSemester}`]).format('DD-MM-YYYY');
        const dateEndSemester = dayjs.unix(student[`end_date_semester_${currenrSemester}`]).format('DD-MM-YYYY');
        raports.push({
          ...student,
          semester: currenrSemester,
          attendance: attendances.find((a) => (
            a.student_x_user_id == student.user_id &&
            a.school_year == student.school_year &&
            a.semester == currenrSemester
          )),
          violations: violations.filter((v) => (
            v.student_x_user_id == student.user_id &&
            v.date >= dateStartSemester &&
            v.date <= dateEndSemester
          )),
          achievements: achievements.filter((a) => (
            a.student_x_user_id == student.user_id &&
            a.date >= dateStartSemester &&
            a.date <= dateEndSemester
          ))
        });

        if (!isValidSemester) {
          const dateStartSemester = dayjs.unix(student[`start_date_semester_2`]).format('DD-MM-YYYY');
          const dateEndSemester = dayjs.unix(student[`end_date_semester_2`]).format('DD-MM-YYYY');
          raports.push({
            ...student,
            semester: 2,
            attendance: attendances.find((a) => (
              a.student_x_user_id == student.user_id &&
              a.school_year == student.school_year &&
              a.semester == 2
            )),
            violations: violations.filter((v) => (
              v.student_x_user_id == student.user_id &&
              v.date >= dateStartSemester &&
              v.date <= dateEndSemester
            )),
            achievements: achievements.filter((a) => (
              a.student_x_user_id == student.user_id &&
              a.date >= dateStartSemester &&
              a.date <= dateEndSemester
            ))
          });
        }
      }

      // Render JSX
      // return raports;
      const { renderToStaticMarkup } = await import("react-dom/server");
      const content = renderToStaticMarkup(<PortofolioNonAcademic students={raports} />);

      // Response
      if (just_html) {
        return new Response(content, { headers: { "Content-Type": "text/html; charset=utf-8" } });
      } else {
        const browser = await puppeteer.launch({
          executablePath: Launcher.getInstallations()[0],
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(content);
        const pdfBuffer = await page.pdf({ format: 'A5', printBackground: true });
        await browser.close();

        set.headers['content-type'] = 'application/pdf';
        set.headers['content-disposition'] = 'inline; filename="generated.pdf"';
        return pdfBuffer;
      }
    });


    return app
  })));



export default PortofolioNonAcademicController