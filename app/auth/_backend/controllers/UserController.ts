import { Elysia } from "elysia";
import { sutando } from "sutando";
import { guardedUserAuthed, LoadUserAuthed } from "@/externals/utils/backend/src/auth-midleware";
import { paginator } from "@/externals/utils/backend";



const UserController = new Elysia()
  .use(LoadUserAuthed)
  .group('/user', (group) => (group.guard({ beforeHandle: guardedUserAuthed }, (app) => {
    app.get('/', async ({ request }) => {
      const qb = sutando.connection('datainduk').table("view_data_users").whereNotNull('name');
      return await paginator(qb, new URL(request.url).searchParams, { searchableCols: ['name', 'uuid'] });
    });



    return app;
  })))



export default UserController;