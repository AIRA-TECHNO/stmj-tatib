import { Elysia } from "elysia";
import { sutando } from "sutando";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

const UserController = new Elysia().use(AuthMiddleware);



UserController.group('/user', (app) => {
  app.get('/', async ({ query }) => {
    const { page, per_page, search } = query;
    const qb = sutando.table("view_data_users");
    if (search) {
      qb.where('name', 'ilike', `%${search}%`);
    }
    const { data, ...paginate } = (await qb.paginate(Number(page ?? 1), Number(per_page ?? 10))).toJSON();
    return { data, paginate };
  });



  return app;
})



export default UserController;