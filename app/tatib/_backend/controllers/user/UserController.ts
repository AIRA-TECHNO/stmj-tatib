import { Elysia, t } from "elysia";
import bcrypt from "bcryptjs";
import { customMessage } from "@/externals/utils/general";
import User from "../../models/User";
import { sutando } from "sutando";

const UserController = new Elysia();


const createUserSchema = t.Object({
  name: t.String(),
  email: t.String(),
  password: t.String(),
})

const updateUserSchema = t.Object({
  name: t.Optional(t.String()),
  email: t.Optional(t.String()),
  password: t.Optional(t.String())
})



UserController.group('/user', (app) => {
  app.get('/', async ({ query }) => {
    const { page, perPage, name, email } = query
    // const qb = User.query();
    const qb = sutando.table("users");
    if (name) qb.where('name', 'ilike', `%${name}%`);
    if (email) qb.where('email', 'ilike', `%${email}%`);
    const { data, ...meta } = (await qb.paginate(Number(page ?? 1), Number(perPage ?? 10))).toJSON();
    return { data, meta };
  })



  app.get('/:id', async ({ params }) => {
    const { id } = params
    const data = await User.query().findOrFail(id);
    return { data }
  })



  app.post('/', async ({ body }) => {
    body.password = await bcrypt.hash(body.password, 10);
    await User.query().create(body);
    return { message: 'Berhasil menyimpan data!' }
  }, { body: customMessage(createUserSchema) })



  app.put("/:id", async ({ params, body, set }) => {
    const user = await User.query().findOrFail(params.id);

    if (body.password) body.password = await bcrypt.hash(body.password, 10);

    for (const [key, value] of Object.entries(body)) {
      if ((user as any)[key]) {
        (user as any)[key] = value;
      }
    }

    return { message: 'Berhasil menyimpan data!' }
  }, { body: customMessage(updateUserSchema) });



  app.delete('/:id', async ({ params }) => {
    const user = await User.query().findOrFail(params.id);
    await user.delete();
    return { message: 'Berhasil menghapus data!' }
  })



  return app
})

export default UserController