const mailer = require("nodemailer");
require("dotenv").config();

const carrier = mailer.createTransport({
  host: "smtpout.secureserver.net",
  port: process.env.NODE_PORT,
  auth: {
    user: process.env.NODE_EMAIL_USER,
    pass: process.env.NODE_EMAIL_PASSWORD,
  },
  secure: false,
  tls: {
    ciphers: "SSLv3",
  },
});

function sendEmail(pdf, reciver) {
  const mail = {
    from: "noreply@sanganastery.live",
    to: reciver,
    subject: `Recieve new message from node server`,
    html: "<p>Download your attachment</p>",
    attachments: {
      filename: "form.pdf",
      content: pdf,
    },
  };

  carrier.sendMail(mail, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = sendEmail;
