// server/api/sendEmail.ts

import express, { Request, Response } from 'express'
import nodemailer from 'nodemailer'
import { fromNodeMiddleware } from 'h3'

const app = express()


interface FormData {
  nome: string
  sobrenome: string
  cpf: string
  placa: string
  email: string
}

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'griffin.johnson66@ethereal.email',
        pass: 'PpVTJDdJwc2v3KjaAk'
    }
});

app.use(express.json())

app.post('/api/sendEmail', async (req: Request, res: Response) => {
  const { nome, sobrenome, cpf, placa, email }: FormData = req.body

  const mailOptions = {
    from: 'griffin.johnson66@ethereal.email',
    to: email,
    subject: 'Dados de Cadastro',
    text: `Nome: ${nome}\nSobrenome: ${sobrenome}\nCPF: ${cpf}\nPlaca: ${placa}\nE-mail: ${email}`
  }

  try {
    await transporter.sendMail(mailOptions)
    res.status(200).send('E-mail enviado com sucesso!')
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error)
    res.status(500).send('Erro ao enviar o e-mail')
  }
})

export default fromNodeMiddleware(app)
