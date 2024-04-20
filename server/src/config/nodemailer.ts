import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.G_MAIL_USERNAME,
    pass: process.env.G_MAIL_PASS,
  },
});

export default transporter;
