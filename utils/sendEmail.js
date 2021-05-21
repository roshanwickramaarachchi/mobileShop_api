const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);

  // // Send Email
  // transporter.sendMail(message, (error, info) => {
  //   if (error) {
  //     console.log('Error, error');
  //   } else {
  //     console.log('Info', info);
  //   }
  // });
};

module.exports = sendEmail;
