import { Elysia, t } from "elysia";
import { customMessage } from "@/externals/utils/general";
import StudentViolation from "../../models/StudentViolation";
import { sutando } from "sutando";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

const StudentViolationController = new Elysia().use(AuthMiddleware);



const validationSchema = t.Object({
  StudentViolation: t.String(),
  point: t.Integer(),
});



StudentViolationController.group('/student-violation', (app) => {
  app.get('/', async ({ query }) => {
    const { page, per_page, search } = query;
    const qb = sutando.table("student_violations AS sv")
      .join('view_data_users AS vdu', 'vdu.id', 'sv.student_x_user_id')
      .select('sv.*', 'vdu.name');
    if (search) {
      qb.where('StudentViolation', 'ilike', `%${search}%`);
    }
    const { data, ...paginate } = (await qb.paginate(Number(page ?? 1), Number(per_page ?? 10))).toJSON();
    return { data, paginate };
  });



  app.get('/:id', async ({ params }) => {
    const { id } = params;
    const data = await StudentViolation.query().findOrFail(id);
    return { data };
  });



  app.post('/', async ({ body }) => {
    const data = await StudentViolation.query().create(body);
    return { data, message: 'Berhasil menyimpan data!' };
  }, { body: customMessage(validationSchema) });



  app.put("/:id", async ({ params, body }) => {
    const data = await StudentViolation.query().findOrFail(params.id);
    await data.update(body);
    return { data, message: 'Berhasil menyimpan data!' };
  }, { body: customMessage(validationSchema) });



  app.delete('/:id', async ({ params }) => {
    const data = await StudentViolation.query().findOrFail(params.id);
    await data.delete();
    return { message: 'Berhasil menghapus data!' };
  });



  return app;
})



export default StudentViolationController;