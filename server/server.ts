import express from 'express'
import sendEmail from './api/sendEmail'

const app = express()
app.use(express.json()) 

app.use('/api', sendEmail)

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})
