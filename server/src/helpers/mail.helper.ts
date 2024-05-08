import { create } from 'express-handlebars';
import transporter from '../config/nodemailer';
import { generateToken } from './jwt.helper';

// rendering data with html to send over email
export const compileHTMLEmailTemplate = (HTMLTemplatePath: string, replacements = {}) =>
  new Promise((resolve) => {
    const compiledHTML = create().render(HTMLTemplatePath, replacements);
    resolve(compiledHTML);
  });

// Email sending using nodemailer
export const sendMail = (toEmail: string, subject: string, htmlContent: unknown) =>
  new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.G_MAIL_USERNAME,
      to: toEmail,
      subject,
      html: htmlContent as string,
    };

    transporter.sendMail(mailOptions, (err: unknown) => {
      if (err) reject(err);
      else resolve({ success: true, message: 'Mail send successfully' });
    });
  });

// sending email verification otp to mail
export const sendVerificationOtp = async (email: string) => {
  const token = generateToken(email);

  // creating otp and save to db
  const otp = Math.floor(100000 + Math.random() * 900000);
  //await Verification.updateOne({ email }, { otp, token }, { upsert: true });

  // converting otp 12334 => "1 2 3 3 4" for sending as user readable
  const otpString = String(otp)
    .split('')
    .reduce((acc, ele) => `${acc} ${ele}`);

  // reading email template and sending email
  const emailTemplatePath = `./src/utils/otp-verification-email.html`;
  const htmlContent = await compileHTMLEmailTemplate(emailTemplatePath, {
    otp: otpString,
  });

  // send mail
  await sendMail(email, 'email verification otp', htmlContent);

  return {
    success: true,
    token,
    message: 'Verification mail send successfully',
  };
};
