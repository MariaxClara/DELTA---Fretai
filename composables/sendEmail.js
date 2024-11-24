
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export function sendWelcomeEmail(userTo, driverName, linkInvite) {
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: userTo,
        subject: 'Bem vindo ao Fretai!',
        text: 'Seja muito bem vindo ao Fretai. Você foi convidado para entrar no grupo do '+driverName +', acesse já pelo link: '+linkInvite,
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          return console.log(error);
        }
        console.log('E-mail enviado: ' + info.response);
    });
}