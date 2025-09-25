import { Elysia } from "elysia";
import { JwtPayload, VerifyErrors, verify } from "jsonwebtoken";
import { sutando } from "sutando";

declare global {
  
  interface typeUserAuthed {
    id?: number;
    username?: string;
    password?: string;
    profile_type?: string;
    created_at?: number;
    updated_at?: number;
    name?: string;
    relation_id?: number;
    uuid?: string;
    roles?: Array<{
      id?: string;
      code?: string;
      name?: string;
      app_id?: string;
      app_name?: string;
      app_code?: string;
      accesses?: Array<{
        id?: string;
        feature?: string;
        access?: string;
        role_id?: string;
      }>
    }>
  }
}

export const LoadUserAuthed = new Elysia()
  .derive({ as: 'global' }, async ({ headers }) => {
    // Init var
    let auth: {
      user: typeUserAuthed | null; message: string | null;
    } = { user: null, message: null };
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
        const secretKey = process.env.JWT_SECRET_KEY || "secretKey";
        const tokenDecoded: any = verify(authToken, secretKey, (error: VerifyErrors | null, decoded?: string | JwtPayload) => (
          error || decoded
        ));

        // Check decoded token
        if (!tokenDecoded?.id) {
          auth.message = 'Invalid token value!';
        } else {
          // Get user by
          const db = sutando.connection('datainduk');
          const user = await db.table('view_data_users').select().where('id', tokenDecoded.id).first()

          // Set exist user
          if (user) {
            auth.user = user;
            let qb = sutando.connection('datainduk').table('user_roles AS ur')
              .join('roles AS r', 'ur.role_id', 'r.id')
              .join('apps AS a', 'r.app_id', 'a.id')
              .where('ur.user_id', user.id)
              .select('r.*', 'a.name AS app_name', 'a.code AS app_code')
            if ((globalThis as any).appCode) qb = qb.where('a.code', (globalThis as any).appCode);
            user.roles = await qb.get();


            // Get access feature
            if (user.roles?.length) {
              const roleAccesses = await sutando.connection('datainduk').table('features AS f')
                .join('role_accesses AS ra', 'ra.feature_id', 'f.id')
                .whereIn('ra.role_id', user.roles.map((r: any) => r.id))
                .whereIn('f.app_id', user.roles.map((r: any) => r.app_id))
                .select(['ra.id', 'f.code AS feature', 'ra.access', 'ra.role_id'])
                .get();
              for (const role of user.roles) {
                role.accesses = roleAccesses.filter((ra) => ra.role_id == role.id);
              }
            }
          } else {
            auth.message = 'Token not match with any user!';
          }
        }
      }
    }

    return { auth }
  })


export const guardedUserAuthed = ({ auth, set }: any) => {
  // if (!auth.user) {
  //   set.status = 401
  //   return auth
  // }
}