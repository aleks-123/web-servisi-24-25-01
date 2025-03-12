const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1 Kreiranje na transporter

  // //! Gmail
  // const transporter = nodemailer.createTransport({
  //   service: 'Gmail',
  //   auth: {
  //     user: 'aleksandar@gmail.com',
  //     pass: '123456789!Q',
  //   },
  // });
  //! manuelen email provider
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'b881a174e483e8',
      pass: 'f2fb94f79b09d5',
    },
  });

  transporter.verify((err, succ) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log('success');
    }
  });

  // 2) definiranje na opciite na mailot
  const mailOptions = {
    from: 'semos <semos@edu.com',
    to: options.email,
    subject: options.subject,
    text: options.messages,
  };

  // 3) go isprame mailot
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
