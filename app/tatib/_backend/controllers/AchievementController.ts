import { Elysia, t } from "elysia";
import Achievement from "../models/Achievement";
import { paginator } from "@/externals/utils/backend";
import { guardedUserAuthed, LoadUserAuthed } from "@/externals/utils/backend/src/auth-midleware";



const validationSchema = t.Object({
  achievement: t.String(),
  point: t.Integer(),
});



const AchievementController = new Elysia()
  .use(LoadUserAuthed)
  .group('/achievement', (group) => (group.guard({ beforeHandle: guardedUserAuthed }, (app) => {
    app.get('/', async ({ request }) => {
      const qb = Achievement.query();
      return await paginator(qb.table('rule_schools'), new URL(request.url).searchParams, { searchableCols: ['achievement'], dateCols: ['created_at'] });
    });



    app.get('/:id', async ({ params }) => {
      const { id } = params;
      const data = await Achievement.query().findOrFail(id);
      return { data };
    });



    app.post('/', async ({ body }) => {
      const data = await Achievement.query().create(body);
      return { data, message: 'Berhasil menyimpan data!' };
    }, { body: validationSchema });



    app.put("/:id", async ({ params, body }) => {
      const data = await Achievement.query().findOrFail(params.id);
      await data.update(body);
      return { data, message: 'Berhasil menyimpan data!' };
    }, { body: validationSchema });



    app.delete('/:id', async ({ params }) => {
      const data = await Achievement.query().findOrFail(params.id);
      await data.delete();
      return { message: 'Berhasil menghapus data!' };
    });



    return app;
  })))



export default AchievementController;