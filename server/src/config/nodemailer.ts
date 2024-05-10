import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.APP_GMAIL_USERNAME,
    pass: process.env.APP_GMAIL_PASS,
  },
});

export default transporter;
