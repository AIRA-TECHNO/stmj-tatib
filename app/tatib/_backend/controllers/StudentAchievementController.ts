import { Elysia, t } from "elysia";
import StudentAchievement from "../models/StudentAchievement";
import { paginator } from "@/externals/utils/backend";
import { guardedUserAuthed, LoadUserAuthed } from "@/externals/utils/backend/src/auth-midleware";



const validationSchema = t.Object({
  achievement: t.String(),
  point: t.Integer(),
});



const StudentAchievementController = new Elysia()
  .use(LoadUserAuthed)
  .group('/student-achievement', (group) => (group.guard({ beforeHandle: guardedUserAuthed }, (app) => {
    app.get('/', async ({ request }) => {
      const qb = StudentAchievement.query();
      return await paginator(qb.table('rule_schools'), new URL(request.url).searchParams, { searchableCols: ['achievement'], dateCols: ['created_at'] });
    });



    app.get('/:id', async ({ params }) => {
      const { id } = params;
      const data = await StudentAchievement.query().findOrFail(id);
      return { data };
    });



    app.post('/', async ({ body }) => {
      const data = await StudentAchievement.query().create(body);
      return { data, message: 'Berhasil menyimpan data!' };
    }, { body: validationSchema });



    app.put("/:id", async ({ params, body }) => {
      const data = await StudentAchievement.query().findOrFail(params.id);
      await data.update(body);
      return { data, message: 'Berhasil menyimpan data!' };
    }, { body: validationSchema });



    app.delete('/:id', async ({ params }) => {
      const data = await StudentAchievement.query().findOrFail(params.id);
      await data.delete();
      return { message: 'Berhasil menghapus data!' };
    });



    return app;
  })))



export default StudentAchievementController;