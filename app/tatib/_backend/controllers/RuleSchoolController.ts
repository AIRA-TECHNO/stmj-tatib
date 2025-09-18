import { Elysia, t } from "elysia";
import { customMessage, stringToArray } from "@/externals/utils/general";
import RuleSchool from "../models/RuleSchool";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { paginator } from "@/externals/utils/backend";
import * as XLSX from 'xlsx'

const RuleSchoolController = new Elysia().use(AuthMiddleware);



const validationSchema = t.Object({
  rule: t.String(),
  point: t.Integer(),
  punishment: t.String(),
});



RuleSchoolController.group('/rule-school', (app) => {
  app.get('/', async ({ request }) => {
    const qb = RuleSchool.query();
    return await paginator(qb, request, ['rule', 'punishment']);
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



  app.delete('/:ids', async ({ params }) => {
    await RuleSchool.query().whereIn('id', stringToArray(params.ids)).delete();
    return { message: 'Berhasil menghapus data!' };
  });



  app.get('/excel/export', async ({ set }) => {
    const data = [
      { Nama: "Andi", Umur: 25, Kota: "Jakarta" },
      { Nama: "Budi", Umur: 30, Kota: "Bandung" },
      { Nama: "Cici", Umur: 22, Kota: "Surabaya" },
    ]

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data")

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx"
    })

    set.headers["Content-Type"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    set.headers["Content-Disposition"] = `attachment; filename="data.xlsx"`

    return buffer
  })



  return app;
})



export default RuleSchoolController;