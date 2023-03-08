import nodemailer from "nodemailer";

export default async function mailer(res, emails, subject, text, html) {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PWD,
    },
  });

  // send mail with defined transport object
  transporter.sendMail(
    {
      from: '"motajer" <sales@motajer.net>',
      to: emails,
      subject,
      text,
      html,
    },
    (error, infor) => {
      if (error) res.status(400).json({ error });
      if (infor) res.status(200).json({ infor });
    }
  );
}
