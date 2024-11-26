import express from 'express' ;
import  sgMail from '@sendgrid/mail';

const router = express.Router();
const config = useRuntimeConfig();

sgMail.setApiKey(config.SENDGRID_API_KEY);
router.post('/sendEmail', async (req, res) => {
  const { to, from, subject, text } = req.body;
  const msg = { to, from, subject, text };
  try {
    await sgMail.send(msg);
    res.status(200).send('Convite enviado com sucesso');
  } catch (error) {
    console.error('Erro ao enviar convite:', error);
    res.status(500).send('Não foi possível enviar o convite');
  }
});
module.exports = router;