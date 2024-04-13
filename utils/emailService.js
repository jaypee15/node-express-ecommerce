const nodemailer = require("nodemailer");

const { EMAIL_USER, EMAIL_PASSWORD } = process.env;
const sendEmail = async (to, subject, text) => {
  try {
    const transport = nodemailer.createTransport({
      services: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: EMAIL_USER,
      to: to,
      subject: subject,
      text: text,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
