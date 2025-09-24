import { Elysia } from 'elysia'
import { HookOnError } from '@/externals/utils/backend';
import config from "../../../sutando.config";
import { sutando } from 'sutando';
import RuleSchoolController from './controllers/RuleSchoolController';
import StudentViolationController from './controllers/StudentViolationController';
import AchievementController from './controllers/AchievementController';
import StudentAchievementController from './controllers/StudentAchievementController';



/**
 * Init DB connection
 */
sutando.addConnection(config.connections.tatib, 'tatib');
sutando.addConnection(config.connections.datainduk, 'datainduk');



/**
 * Instance server
 */
(globalThis as any).appCode = 'tatib';
const server = new Elysia({ prefix: '/tatib/api', });



/**
 * Register error handler
 */
server.onError(HookOnError as any)



/**
 * Register routes
 */
server.use(RuleSchoolController);
server.use(StudentViolationController);
server.use(AchievementController);
server.use(StudentAchievementController);


// // Testing sutando => (GET) http://localhost:3000/api/test-env
// server.get("/test-env", async () => {
//   return {
//     host: process.env.TATIB_X_DB_HOST,
//     port: Number(process.env.TATIB_X_DB_PORT),
//     user: process.env.TATIB_X_DB_USERNAME,
//     password: process.env.TATIB_X_DB_PASSWORD,
//     database: process.env.TATIB_X_DB_DATABASE,
//   }
// });

export default server