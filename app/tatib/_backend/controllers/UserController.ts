import { Elysia } from "elysia";
import { sutando } from "sutando";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { paginator } from "@/externals/utils/backend";

const UserController = new Elysia().use(AuthMiddleware);



UserController.group('/user', (app) => {
  app.get('/', async ({ request }) => {
    const qb = sutando.connection('tatib').table("view_data_users").whereNotNull('name');
    return await paginator(qb, request, ['name', 'uuid']);
  });



  return app;
})



export default UserController;