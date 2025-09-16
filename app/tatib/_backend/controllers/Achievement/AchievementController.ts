import { Elysia, t } from "elysia";
import { customMessage } from "@/externals/utils/general";
import Achievement from "../../models/Achievement";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

const AchievementController = new Elysia().use(AuthMiddleware);



const validationSchema = t.Object({
  achievement: t.String(),
  point: t.Integer(),
});



AchievementController.group('/achievement', (app) => {
  app.get('/', async ({ query }) => {
    const { page, per_page, search } = query;
    const qb = Achievement.query();
    if (search) {
      qb.where('achievement', 'ilike', `%${search}%`);
    }
    const { data, ...paginate } = (await qb.paginate(Number(page ?? 1), Number(per_page ?? 10))).toJSON();
    return { data, paginate };
  });



  app.get('/:id', async ({ params }) => {
    const { id } = params;
    const data = await Achievement.query().findOrFail(id);
    return { data };
  });



  app.post('/', async ({ body }) => {
    const data = await Achievement.query().create(body);
    return { data, message: 'Berhasil menyimpan data!' };
  }, { body: customMessage(validationSchema) });



  app.put("/:id", async ({ params, body }) => {
    const data = await Achievement.query().findOrFail(params.id);
    await data.update(body);
    return { data, message: 'Berhasil menyimpan data!' };
  }, { body: customMessage(validationSchema) });



  app.delete('/:id', async ({ params }) => {
    const data = await Achievement.query().findOrFail(params.id);
    await data.delete();
    return { message: 'Berhasil menghapus data!' };
  });



  return app;
})



export default AchievementController;