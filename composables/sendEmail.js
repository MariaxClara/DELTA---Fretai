
import { Resend } from 'resend';

const resend = new Resend('re_CosjbNBs_HKdVjzQmFCv3Ps2Q1r2ntmqP');

export async function sendWelcomeEmail(userTo, driverName, linkInvite) {
  try {
    console.log("Enviando email")
    const data = await resend.emails.send({
      from: 'fretaiunifesp@gmail.com',
      to: userTo,
      subject: 'Bem vindo ao Fretai!',
      text: 'Seja muito bem vindo ao Fretai. Você foi convidado para entrar no grupo do '+driverName +', acesse já pelo link: '+linkInvite,
      mode: 'no-cors'
    });
    console.log("Email enviado: ")
    console.log(data)
    return data;
  } catch (error) {

    console.log("Parece que não conseguimos enviar o email: ")
    console.log(error)
    return { error };
  
  }
}

// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// export function sendWelcomeEmail(userTo, driverName, linkInvite) {
//     let mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: userTo,
//         subject: 'Bem vindo ao Fretai!',
//         text: 'Seja muito bem vindo ao Fretai. Você foi convidado para entrar no grupo do '+driverName +', acesse já pelo link: '+linkInvite,
//     };
//     transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//           return console.log(error);
//         }
//         console.log('E-mail enviado: ' + info.response);
//     });
// }