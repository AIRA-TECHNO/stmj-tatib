import { Elysia, t } from "elysia";
import { customMessage, stringToArray } from "@/externals/utils/general";
import { basicStyleCellExcel, typeProtoSheet, uploadAndLoadExcel } from "@/externals/utils/backend";
import RuleSchool from "../models/RuleSchool";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { paginator } from "@/externals/utils/backend";
import ExcelJS from 'exceljs';
import { sutando } from "sutando";
import fs from 'fs';

const RuleSchoolController = new Elysia().use(AuthMiddleware);



const validationSchema = t.Object({
  rule: t.String(),
  point: t.Integer(),
  punishment: t.String(),
});



async function getRuleSchool(searchParams: URLSearchParams) {
  const qb = sutando.connection('tatib');
  return await paginator(qb.table('rule_schools'), searchParams, { searchableCols: ['rule', qb.raw('punishment::text')], dateCols: ['created_at'] });
}



RuleSchoolController.group('/rule-school', (app) => {
  app.get('/', async ({ request }) => await getRuleSchool(new URL(request.url).searchParams));



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



  app.delete('/', async ({ body }) => {
    await RuleSchool.query().whereIn('id', stringToArray(body.ids)).delete();
    return { message: 'Berhasil menghapus data!' };
  }, { body: customMessage(t.Object({ ids: t.Any() })) });



  app.post('/excel/import', async ({ body, set }) => {
    const { workbook, tempPath } = await uploadAndLoadExcel(body.file as File, '/import-rule-schools')

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      fs.unlinkSync(tempPath);
      set.status = 500;
      return { message: 'Worksheet not found!' };
    }

    const dataRuleSchools: { rule?: string, point?: string, punishment?: string }[] = [];
    worksheet.eachRow((row) => {
      dataRuleSchools.push({
        rule: row.getCell(1)?.value?.toString(),
        point: row.getCell(2)?.value?.toString(),
        punishment: row.getCell(3)?.value?.toString(),
      });
    });

    for (const dataRuleSchool of dataRuleSchools) {
      await RuleSchool.query().create(dataRuleSchool);
    }

    return { message: 'Berhasil mengimport data!' };
  }, {
    body: customMessage(t.Object({ file: t.File({ mime: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] }) }))
  });



  app.get('/excel/export', async ({ set, request, query }) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Master');
    if (!worksheet) { set.status = 500; return ({ message: "Failed init worksheet!" }); };

    const protoSheets: typeProtoSheet[] = [
      { label: "peraturan", name: 'rule', width: 50 },
      { label: "poin", name: "point", width: 10 },
      { label: "sanksi", name: "punishment", width: 100 },
    ];

    let dataSheets = [];
    if (!query.isMaster) {
      const url = new URL(request.url);
      url.searchParams.set('per_page', '0');
      dataSheets = Array.from((await getRuleSchool(url.searchParams)).data);
    }

    protoSheets.forEach((ps, indexPs) => {
      const numCol = indexPs + 1;
      worksheet.getColumn(numCol).width = ps.width;
      worksheet.getRow(1).getCell(numCol).value = ps.label;
      basicStyleCellExcel(worksheet.getRow(1).getCell(numCol), { bgColor: '00B050', textColor: 'FFFFFF', isBold: true, textCenter: true });

      dataSheets.forEach((ds, indexDs) => {
        const numRow = indexDs + 2;
        const colValue = (typeof ps.name == 'function') ? ps.name(ds) : ds?.[ps.name];
        worksheet.getRow(numRow).getCell(numCol).value = colValue;
        basicStyleCellExcel(worksheet.getRow(numRow).getCell(numCol));
      });
    });

    return await workbook.xlsx.writeBuffer();
  });





  return app;
})



export default RuleSchoolController;