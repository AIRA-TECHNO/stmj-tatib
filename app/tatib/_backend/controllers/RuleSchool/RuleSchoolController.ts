import { Elysia, t } from "elysia";
import { customMessage } from "@/externals/utils/general";
import RuleSchool from "../../models/RuleSchool";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

const RuleSchoolController = new Elysia().use(AuthMiddleware);



const validationSchema = t.Object({
  rule: t.String(),
  point: t.Integer(),
});



RuleSchoolController.group('/rule-school', (app) => {
  app.get('/', async ({ query }) => {
    const { page, per_page, search } = query;
    const qb = RuleSchool.query();
    if (search) {
      qb.where('rule', 'ilike', `%${search}%`);
    }
    const { data, ...meta } = (await qb.paginate(Number(page ?? 1), Number(per_page ?? 10))).toJSON();
    return { data, meta };
  });



  app.get('/:id', async ({ params }) => {
    const { id } = params;
    const data = await RuleSchool.query().findOrFail(id);
    return { data };
  });



  app.post('/', async ({ body }) => {
    const data = await RuleSchool.query().create(body);
    return { data, message: 'Berhasil menyimpan data!' };
  }, { body: customMessage(validationSchema) });



  app.put("/:id", async ({ params, body }) => {
    const data = await RuleSchool.query().findOrFail(params.id);
    await data.update(body);
    return { data, message: 'Berhasil menyimpan data!' };
  }, { body: customMessage(validationSchema) });



  app.delete('/:id', async ({ params }) => {
    const data = await RuleSchool.query().findOrFail(params.id);
    await data.delete();
    return { message: 'Berhasil menghapus data!' };
  });



  return app;
})



export default RuleSchoolController;