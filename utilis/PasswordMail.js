module.exports = () => {
  var nodemailer = require("nodemailer");

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "syedhanifullah55@gmail.com",
      pass: "reactdev",
    },
  });

  var mailOptions = {
    to: "haneef@hashloops.com",
    from: "syedhanifullah55@gmail.com",
    subject: "Sending Email using Node.js",
    text: "That was easy!",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
