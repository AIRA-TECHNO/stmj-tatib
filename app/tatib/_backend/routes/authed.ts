import Elysia from "elysia";
import UserController from "../controllers/user/UserController";
import AuthController from "../controllers/auth/AuthController";

const AuthedRoutes = new Elysia();


AuthedRoutes.use(AuthController)
AuthedRoutes.use(UserController)


export default AuthedRoutes