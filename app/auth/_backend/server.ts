import { Elysia } from 'elysia'
import { HookOnError } from '@/externals/utils/backend';
import config from "../../../sutando.config";
import { sutando } from 'sutando';
import AuthController from './controllers/AuthController';



/**
 * Init DB connection
 */
sutando.addConnection(config.connections.datainduk, 'datainduk');



/**
 * Instance server
 */
const server = new Elysia({ prefix: '/auth/api', });



/**
 * Register error handler
 */
server.onError(HookOnError as any)



/**
 * Register routes
 */
server.use(AuthController);

export default server