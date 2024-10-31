// server/api/login.ts
import express, { Request, Response } from 'express'
import database from '../plugins/database'

const router = express.Router()

interface LoginRequestBody {
  email: string,
  password: string
}

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginRequestBody

  try {
    const { loginUser } = database()
    const user = await loginUser(email, password)

    if (user) {
      res.status(200).json({
        success: true,
        userId: user.userId,
        primeiro_login: user.primeiro_login,
      })
    } else {
      res.status(401).json({ success: false, message: 'Email ou senha incorretos' })
    }
  } catch (error) {
    console.error('Erro no endpoint de login:', error)
    res.status(500).json({ success: false, message: 'Erro interno do servidor' })
  }
})

export default router
