import { Elysia, t } from "elysia";
import Achievement from "../models/Achievement";
import { paginator } from "@/externals/utils/backend";
import { guardedUserAuthed, LoadUserAuthed } from "@/externals/utils/backend/src/auth-midleware";
import { stringToArray } from "@/externals/utils/general";



const validationSchema = t.Object({
  achievement: t.String(),
  point: t.Integer(),
});



const AchievementController = new Elysia()
  .use(LoadUserAuthed)
  .group('/achievement', (group) => (group.guard({ beforeHandle: guardedUserAuthed }, (app) => {
    app.get('/', async ({ request }) => {
      const qb = Achievement.query();
      return await paginator(qb, new URL(request.url).searchParams, { searchableCols: ['achievement'], dateCols: ['created_at'] });
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



    app.delete('/', async ({ body }) => {
      await Achievement.query().whereIn('id', stringToArray(body.ids)).delete();
      return { message: 'Berhasil menghapus data!' };
    }, {
      body: t.Object({ ids: t.Any() }),
      beforeHandle: ({ auth }) => {
        // if (!checkAccess([`${keyFeature}>=2`], auth.user?.roles)) return abort(403);
      }
    });



    return app;
  })))



export default AchievementController;