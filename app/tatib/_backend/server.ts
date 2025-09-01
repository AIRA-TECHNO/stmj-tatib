import { Elysia } from 'elysia'
import { HookOnError } from '@/externals/utils/backend';
import config from "../../../sutando.config";
import { sutando } from 'sutando';
import AuthedRoutes from './routes/authed';



/**
 * Init DB connection
 */
sutando.addConnection(config);



/**
 * Instance server
 */
const server = new Elysia({ prefix: '/api', });



/**
 * Register error handler
 */
server.onError(HookOnError as any)



/**
 * Register routes
 */
server.use(AuthedRoutes)


// // Testing sutando => (GET) http://localhost:3000/api/test
// server.get("/test", async () => {
//   const sql = await User.query().get();
//   return { sql };
// });

export default server