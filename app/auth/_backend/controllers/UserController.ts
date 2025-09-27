import { Elysia } from "elysia";
import { sutando } from "sutando";
import { guardedUserAuthed, LoadUserAuthed } from "@/externals/utils/backend/src/auth-midleware";
import { paginator } from "@/externals/utils/backend";
import { stringToArray } from "@/externals/utils/general";



const UserController = new Elysia()
  .use(LoadUserAuthed)
  .group('/user', (group) => (group.guard({ beforeHandle: guardedUserAuthed }, (app) => {
    app.get('/', async ({ request, query }) => {
      const {
        with_class,
        school_years,
        class_ids,
        member_of_study_group_ids,
        teacher_of_study_group_ids,
        parent_of_user_ids,
        child_of_user_ids,
      } = query;
      const db = sutando.connection('datainduk');
      const qb = db.table("view_data_users AS vdu")
        .select(
          "vdu.id",
          "vdu.username",
          "vdu.profile_type",
          "vdu.name",
          "vdu.relation_id",
          "vdu.uuid",
        )
        .where('vdu.profile_type', 'Siswa')
        .whereNotNull('name')
        .orderBy('vdu.name', 'asc');
      if (with_class || class_ids || school_years) {
        qb
          .leftJoin((qbSub) => (
            qbSub.table('student_classes as sc')
              .fullOuterJoin('view_data_classes as vdc', 'vdc.class_id', 'sc.class_id')
              .select('vdc.*', 'sc.student_x_user_id')
              .whereIn(db.raw('(sc.student_x_user_id, vdc.class_level)'), (qbSubWhereIn) => {
                qbSubWhereIn.table('student_classes as sc2')
                  .fullOuterJoin('view_data_classes as vdc2', 'sc2.class_id', 'vdc2.class_id')
                  .select('sc2.student_x_user_id', db.raw('MAX(vdc2.class_level) AS class_level'))
                  .groupBy('sc2.student_x_user_id');
                if (Boolean(school_years)) {
                  qbSubWhereIn.where('vdc2.school_year', 'in', stringToArray(school_years, Number))
                }
                if (Boolean(class_ids)) {
                  qbSubWhereIn.where('vdc2.class_id', 'in', stringToArray(class_ids, Number))
                }
                return qbSubWhereIn;
              }).as('vsc')
          ), (qbJoin) => (qbJoin.on('vsc.student_x_user_id', 'vdu.id')))
          .select('vsc.class_full_name', 'vsc.class_id')
      }
      if (class_ids || school_years) qb.whereNotNull('vsc.class_id');
      if (member_of_study_group_ids) {
        qb.innerJoin('view_member_study_groups as vmsg', (subQb) => (
          subQb.on('vmsg.student_x_user_id', 'vdu.id').onIn('vmsg.study_group_id', stringToArray(member_of_study_group_ids, Number))
        ))
      }
      if (teacher_of_study_group_ids) {
        qb.whereIn('vdu.id', (subQb) => subQb.table('teacher_study_groups as tsg')
          .select('tsg.teacher_x_user_id')
          .whereIn('tsg.study_group_id', stringToArray(teacher_of_study_group_ids, Number))
        )
      }
      if (parent_of_user_ids) {
        qb.innerJoin('student_parents as sp', (subQb) => (
          subQb.on('sp.parent_x_user_id', 'vdu.id').onIn('sp.student_x_user_id', stringToArray(parent_of_user_ids, Number))
        ))
      }
      if (child_of_user_ids) {
        qb.innerJoin('student_parents as sp', (subQb) => {
          subQb.on('sp.student_x_user_id', 'vdu.id').onIn('sp.parent_x_user_id', stringToArray(child_of_user_ids, Number))
        })
      }

      let searchableCols = [
        "vdu.username",
        "vdu.profile_type",
        "vdu.name",
        "vdu.uuid",
      ];
      if (with_class || class_ids || school_years) searchableCols = searchableCols.concat(['vsc.class_full_name']);

      return await paginator(qb, new URL(request.url).searchParams, { searchableCols });
    });



    return app;
  })))



// .group('/user', (group) => (group.guard({ beforeHandle: guardedUserAuthed }, (app) => {
//   app.get('/', async ({ request, query }) => {
//     const qb = sutando.connection('datainduk').table("view_data_users AS vdu")
//       .select(
//         "vdu.id",
//         "vdu.username",
//         "vdu.profile_type",
//         "vdu.name",
//         "vdu.relation_id",
//         "vdu.uuid",
//       )
//       .whereNotNull('name');

//     if (query.with_class) {
//       qb.leftJoin('student_classes AS sc', 'sc.student_x_user_id', 'sa.student_x_user_id')
//         .leftJoin('view_data_classes AS vdc', 'vdc.class_id', 'sc.class_id')
//         .select(qb.raw('MAX(vdc.class_full_name) AS class_full_name'))
//         .groupBy('sa.id', 'vdu.name');
//     }
//     return await paginator(qb, new URL(request.url).searchParams, { searchableCols: ['vdu.name', 'vdu.uuid'] });
//   });



//   return app;
// })))



export default UserController;