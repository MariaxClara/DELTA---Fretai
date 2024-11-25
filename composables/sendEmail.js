import sgMail from '@sendgrid/mail'
import axios, * as others from 'axios'

export async function sendWelcomeEmail(userTo, driverName, linkInvite) {
  const config = useRuntimeConfig();
  sgMail.setApiKey(config.SENDGRID_API_KEY)  
  let msg = {
        to: userTo,
        from: "fretaiunifesp@gmail.com",
        subject: "Bem vindo ao Fretai",
        text: 'Seja muito bem vindo ao Fretai. Você foi convidado para entrar no grupo do '+driverName +', acesse já pelo link: '+linkInvite,
        mode: 'no-cors'
  }
  console.log("Irei enviar o email agora!")
  sgMail.send(msg).then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error("Não consegui enviar o email: ", error)
  })
}