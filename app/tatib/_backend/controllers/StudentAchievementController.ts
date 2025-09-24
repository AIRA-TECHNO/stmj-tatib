import { Elysia, t } from "elysia";
import StudentAchievement from "../models/StudentAchievement";
import { paginator } from "@/externals/utils/backend";
import { guardedUserAuthed, LoadUserAuthed } from "@/externals/utils/backend/src/auth-midleware";
import { stringToArray } from "@/externals/utils/general";
import { sutando } from "sutando";
import Achievement from "../models/Achievement";



const validationSchema = t.Object({
  student_x_user_id: t.Integer(),
  achievement_id: t.Integer(),
  note: t.String(),
  date: t.Date(),
});



const StudentAchievementController = new Elysia()
  .use(LoadUserAuthed)
  .group('/student-achievement', (group) => (group.guard({ beforeHandle: guardedUserAuthed }, (app) => {
    app.get('/', async ({ request }) => {
      const db = sutando.connection('tatib');
      const qb = db.table("student_achievements AS sa")
        .join('view_data_users AS vdu', 'vdu.id', 'sa.student_x_user_id')
        .leftJoin('student_classes AS sc', 'sc.student_x_user_id', 'sa.student_x_user_id')
        .leftJoin('view_data_classes AS vdc', 'vdc.class_id', 'sc.class_id')
        .select('sa.*', 'vdu.name', db.raw('MAX(vdc.class_full_name) AS class_full_name'))
        .groupBy('sa.id', 'vdu.name');
      return await paginator(qb, new URL(request.url).searchParams, { searchableCols: ['vdu.name', 'sa.achievement', 'sa.point', 'sa.note'], dateCols: ['created_at'] });
    });



    app.get('/:id', async ({ params }) => {
      const { id } = params;
      const data = await StudentAchievement.query().findOrFail(id);
      return { data };
    });



    app.post('/', async ({ body, auth }) => {
      const achievement = await Achievement.query().findOrFail(body.achievement_id);
      const data = await StudentAchievement.query().create({
        ...body,
        author_x_user_id: auth.user?.id ?? null,
        achievement: achievement.achievement,
        point: achievement.point
      });
      return { data, message: 'Berhasil menyimpan data!' };
    }, { body: validationSchema });



    app.put("/:id", async ({ params, body }) => {
      const data = await StudentAchievement.query().findOrFail(params.id);
      const achievement = await Achievement.query().findOrFail(body.achievement_id);
      data.update({
        ...body,
        achievement: achievement.achievement,
        point: achievement.point
      });

      await data.update(body);
      return { data, message: 'Berhasil menyimpan data!' };
    }, { body: validationSchema });



    app.delete('/', async ({ body }) => {
      await StudentAchievement.query().whereIn('id', stringToArray(body.ids)).delete();
      return { message: 'Berhasil menghapus data!' };
    }, {
      body: t.Object({ ids: t.Any() }),
    });



    return app;
  })))



export default StudentAchievementController;