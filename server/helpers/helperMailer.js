import nodemailer from 'nodemailer';


class Mailer {
  static async sendMail(options) {
    try {
      const from = options.sender;
      const { to, subject, html } = options;
      const mailOptions = {
        from, to, subject, html,
      };
      const transporter = await nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'politico953@gmail.com',
          pass: 'America@1',
        },
      });
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (err) {
      return err;
    }
  }
}

export default Mailer;
