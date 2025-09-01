import { Elysia, t } from "elysia"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../../models/User";

const AuthController = new Elysia();

const authSchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String()
})

AuthController.group('/auth', (app) => {
  app.post('/login', async ({ body, set }) => {
    const { email, password } = body;

    const user = await User.query().where({ email }).first()

    if (!user) {
      set.status = 422
      return { message: 'Login failed. Email not found.' }
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      set.status = 422
      return { message: 'Login failed. Wrong password.' }
    }

    const secretKey = process.env.JWT_SECRET || 'secretKey'
    const token = jwt.sign(
      { userId: user.id },
      secretKey,
      { expiresIn: '1d' }
    )

    return {
      message: 'success login',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  }, { body: authSchema })

  app.get('/test', async ({ headers, set }) => {
    const authHeader = headers.authorization
    if (!authHeader) {
      set.status = 401
      return { message: 'No token provided' }
    }

    const token = authHeader.split(' ')[1]
    const secretKey = process.env.JWT_SECRET || 'secretKey'
    const decoded: any = jwt.verify(token, secretKey)

    return {
      message: 'You are authorized',
      userId: decoded.userId
    }
  })

  return app
})

export default AuthController