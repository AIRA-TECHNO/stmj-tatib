import { Elysia, t } from "elysia"
import bcrypt from "bcryptjs"
import { Algorithm, sign, verify } from "jsonwebtoken"
import { sutando } from "sutando";

const AuthController = new Elysia();

const authSchema = t.Object({
  username: t.String(),
  password: t.String()
})

AuthController.group('/auth', (app) => {
  app.post('/login', async ({ body, set }) => {
    const { username, password } = body;

    const user = await sutando.table('view_data_users')
      .select('id', 'username', 'password')
      .where({ username })
      .first()

    if (!user) {
      set.status = 422
      return { message: 'Login failed. Email not found.' }
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      set.status = 422
      return { message: 'Login failed. Wrong password.' }
    }

    delete user.password;
    const secretKey = process.env.JWT_SECRET || 'secretKey'
    const algorithm = (process.env.JWT_ALGORITHM || 'HS256') as Algorithm;
    const token = sign(user, secretKey, { algorithm })

    return { message: 'Login berhasil!', token, user }
  }, { body: authSchema })

  app.get('/test', async ({ headers, set }) => {
    // Check exist token
    const authHeader = headers.authorization
    if (!authHeader) {
      set.status = 401
      return { message: 'No token provided' }
    }

    // Check type token
    const [tokenType, tokenValue] = authHeader.split(' ')[1];
    if (tokenType !== 'Bearer' || !tokenValue) {
      set.status = 401;
      return ({ message: "Auth header authorization must a bearer token!" });
    }

    // Check valid token
    const secretKey = process.env.JWT_SECRET || 'secretKey';
    const decoded: any = verify(tokenValue, secretKey);
    if (!decoded?.id) {
      set.status = 401;
      return ({ message: "Token invalid!" });
    }

    // Response
    return {
      message: 'You are authorized',
      userId: decoded.userId
    }
  })

  return app
})

export default AuthController