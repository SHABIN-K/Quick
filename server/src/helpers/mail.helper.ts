import { create } from 'express-handlebars';
import transporter from '../config/nodemailer';

/**
 * Compiles an HTML email template with optional replacements.
 * 
 * @param HTMLTemplatePath - The path to the HTML template file.
 * @param replacements - Optional replacements to be applied to the template.
 * @returns A promise that resolves to the compiled HTML.
 */
export const compileHTMLEmailTemplate = (HTMLTemplatePath: string, replacements = {}) =>
  new Promise((resolve) => {
    const compiledHTML = create().render(HTMLTemplatePath, replacements);
    resolve(compiledHTML);
  });




/**
 * Sends an email.
 * 
 * @param toEmail - The recipient's email address.
 * @param subject - The subject of the email.
 * @param htmlContent - The HTML content of the email.
 * @returns A promise that resolves to an object with a success flag and a message indicating the status of the email sending.
 */
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
  const token = 'aasdfasfasdfsdafsdafsd';

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
