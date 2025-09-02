import { Elysia } from "elysia";
import { JwtPayload, VerifyErrors, verify } from "jsonwebtoken";
import ViewDataUser from "../models/ViewDataUser";
import { sutando } from "sutando";


export const LoadUserAuthedMiddleware = new Elysia()
  .derive({ as: 'global' }, async ({ headers }) => {
    // Init var
    let auth: { user: ViewDataUser | null; message: string | null; } = { user: null, message: null };
    const TOKEN_SSO_SIMBAH = headers.authorization;

    // Check exist token
    if (!TOKEN_SSO_SIMBAH) {
      auth.message = 'Auth token not exist!';
    } else {
      const [authType, authToken] = String(TOKEN_SSO_SIMBAH).split(' ');

      // Check type token
      if ((authType !== 'Bearer') || !authToken) {
        auth.message = 'Invalid token type!';
      } else {

        // Decode token
        const secretKey = process.env.JWT_SECRET_KEY ?? "randomKey";
        const tokenDecoded: any = verify(authToken, secretKey, (error: VerifyErrors | null, decoded?: string | JwtPayload) => (
          error || decoded
        ));

        // Check decoded token
        if (!tokenDecoded?.id) {
          auth.message = 'Invalid token value!';
        } else {
          // Get user by
          const user = await sutando.table('view_data_users').select().where('id', tokenDecoded.id).first()

          // Set exist user
          if (user) {
            auth.user = user
          } else {
            auth.message = 'Token not match with any user!';
          }
        }
      }
    }

    return { auth }
  })




export const AuthMiddleware = (new Elysia()).use(LoadUserAuthedMiddleware).onBeforeHandle(({ auth, set }) => {
  if (!auth.user) {
    set.status = 401;
    return auth;
  }
})