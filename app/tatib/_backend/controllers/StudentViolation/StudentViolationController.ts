import { Elysia, t } from "elysia";
import { customMessage, stringToArray } from "@/externals/utils/general";
import StudentViolation from "../../models/StudentViolation";
import { sutando } from "sutando";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { paginator } from "@/externals/utils/backend";
import RuleSchool from "../../models/RuleSchool";

const StudentViolationController = new Elysia().use(AuthMiddleware);



const validationSchema = t.Object({
  student_x_user_id: t.Integer(),
  rule_school_id: t.Integer(),
  note: t.String(),
  date: t.Date(),
});



StudentViolationController.group('/student-violation', (app) => {
  app.get('/', async ({ request }) => {
    const db = sutando.connection('tatib');
    const qb = db.table("student_violations AS sv")
      .join('view_data_users AS vdu', 'vdu.id', 'sv.student_x_user_id')
      .leftJoin('student_classes AS sc', 'sc.student_x_user_id', 'sv.student_x_user_id')
      .leftJoin('view_data_classes AS vdc', 'vdc.class_id', 'sc.class_id')
      .select('sv.*', 'vdu.name', db.raw('MAX(vdc.class_full_name) AS class_full_name'))
      .groupBy('sv.id', 'vdu.name');
    return await paginator(qb, request, ['vdu.name', 'sv.rule', 'sv.point', 'sv.note']);
  });



  app.get('/:id', async ({ params }) => {
    const { id } = params;
    const data = await StudentViolation.query().findOrFail(id);
    return { data };
  });



  app.post('/', async ({ body, auth }) => {
    const ruleSchool = await RuleSchool.query().findOrFail(body.rule_school_id);
    const data = await StudentViolation.query().create({
      ...body,
      author_x_user_id: auth.user?.id ?? null,
      rule: ruleSchool.rule,
      point: ruleSchool.point
    });
    return { data, message: 'Berhasil menyimpan data!' };
  }, { body: customMessage(validationSchema) });



  app.put("/:id", async ({ params, body, auth }) => {
    const data = await StudentViolation.query().findOrFail(params.id);
    const ruleSchool = await RuleSchool.query().findOrFail(body.rule_school_id);
    await data.update({
      ...body,
      author_x_user_id: auth.user?.id ?? null,
      rule: ruleSchool.rule,
      point: ruleSchool.point
    });
    return { data, message: 'Berhasil menyimpan data!' };
  }, { body: customMessage(validationSchema) });



  app.delete('/:ids', async ({ params }) => {
    await StudentViolation.query().whereIn('id', stringToArray(params.ids)).delete();
    return { message: 'Berhasil menghapus data!' };
  });



  return app;
})



export default StudentViolationController;