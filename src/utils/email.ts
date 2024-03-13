import AppError from './errorhandler';
import nodemailer from 'nodemailer';
import path from 'path';
import ejs from 'ejs';

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html: string;
}

class EmailSender {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(toAddress: string, subject: any, text: any, html: any) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: toAddress,
        subject: subject,
        text: text,
        html: html,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Email sent to:', toAddress);
    } catch (error: any) {
      console.log(error);
      throw new AppError(error, 500);
    }
  }

  async sendWelcomeEmail(user: any) {
    const emailAddress: string = user.email;
    const username: string = user.username;
    const message: string = `Welcome to briefly , your number one platform for short url. We are delighted to have you`;
    const heading = 'Welcome';
    const templatePath = path.join(__dirname, '../view/welcome.ejs');
    const template = await ejs.renderFile(templatePath, {
      message,
      username,
      heading,
    });

    return this.sendEmail(emailAddress, message, heading, template);
  }

  async sendPasswordResetEmail(user: any, resetToken: string, url: string) {
    const timeRemainingInMinutes = Math.max(
      0,
      Math.ceil((user.resetTimeExp - Date.now()) / 60000)
    );
    const username: string = user.username;
    const emailAddress: string = user.email;
    const message: string = `You have requested for a password reset Token.\n
    Your reset password token is ${resetToken}.
    This token will be expiring in the next ${timeRemainingInMinutes} minutes`;
    const heading: string = 'Password Reset';
    const templatePath: string = path.join(__dirname, '../view/resetEmail.ejs');
    const template: any = await ejs.renderFile(templatePath, {
      message,
      username,
      heading,
      url,
      token: resetToken,
    });

    return this.sendEmail(emailAddress, message, heading, template);
  }
}

export default EmailSender;
