const nodemailer = require("nodemailer");

const { EMAIL_USER, EMAIL_PASSWORD } = process.env;
const sendEmail = async (to, subject, text) => {
  try {
    const transport = nodemailer.createTransport({
      // services: "gmail",
      // auth: {
      //   user: EMAIL_USER,
      //   pass: EMAIL_PASSWORD,
      // },

      service: 'gmail',
            port:465,
            secure: true,
            secureConnection: false,
            auth: { 
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD, 
            },
            tls:{
                rejectUnAuthorized:true
            }
    });
    const mailOptions = {
      from: EMAIL_USER,
      to: to,
      subject: subject,
      text: text,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error);
    next();
  }
};

module.exports = sendEmail;
