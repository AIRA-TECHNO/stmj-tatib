import { Elysia, t } from "elysia"
import bcrypt from "bcryptjs"
import { Algorithm, sign } from "jsonwebtoken"
import { sutando } from "sutando";

const AuthController = new Elysia();

const authSchema = t.Object({
  username: t.String({ minLength: 2 }),
  password: t.String({ minLength: 1 }),
})

AuthController.group('', (app) => {
  app.post('/login', async ({ body, set }) => {
    const { username, password } = body;

    const user = await sutando.connection('datainduk').table('view_data_users')
      .select('id', 'username', 'password')
      .where({ username })
      .first()

    if (!user) {
      set.status = 422
      return { invalids: { username: ['Username tidak terdaftar!'] } }
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      set.status = 422
      return { invalids: { password: ['Password salah!'] } }
    }

    delete user.password;
    const secretKey = process.env.JWT_SECRET || 'secretKey'
    const algorithm = (process.env.JWT_ALGORITHM || 'HS256') as Algorithm;
    const token = sign(user, secretKey, { algorithm })

    return { message: 'Login berhasil!', token, user }
  }, { body: (authSchema) })

  return app
})

export default AuthController