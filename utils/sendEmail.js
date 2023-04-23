const nodemailer = require("nodemailer");

const sendEmail = async (options) => {

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailerOptions = {
    from: "E-commerce Ibrahim <ibrahimabdalr7man@gmail.com> via outlook.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailerOptions);
};


module.exports = sendEmail;