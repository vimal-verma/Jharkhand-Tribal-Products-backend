var ejs = require("ejs");
var nodemailer = require("nodemailer");
var mg = require('nodemailer-mailgun-transport');

var auth = {
  auth: {
    api_key: process.env.MAILGUN_KEY,
    domain: 'mail.vimalverma.in'
  }
}

var transporter = nodemailer.createTransport(mg(auth));

module.exports.sendWelcomeEmail = async (user, email) => {
  ejs.renderFile(__dirname + "/../public/welcome.ejs", { user, url: 'vimalverma.in' }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      var mainOptions = {
        from: 'vimalverma me@vimalverma.in',
        to: email,
        subject: `Welcome to jharkhand tribal product shop, ${user}!`,
        html: data
      };
      transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log('Message sent: ' + info.message);
        }
      });
    }
  });
}

module.exports.sendPassResetEmail = async (user, email, url) => {
  ejs.renderFile(__dirname + "/../public/resetpassword.ejs", { user, url }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      var mainOptions = {
        from: 'vimalverma me@vimalverma.in',
        to: email,
        subject: `Hi ${user}!, You have requested to reset your password`,
        html: data
      };

      transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log('Message sent: ' + info.message);
        }
      });
    }
  });
}

module.exports.sendOrderEmail = async (user, email, product) => {
  ejs.renderFile(__dirname + "/../public/order.ejs", { user, product }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      var mainOptions = {
        from: 'vimalverma me@vimalverma.in',
        to: email,
        subject: `Hi ${user}!, You have Ordered a Product`,
        html: data
      };

      transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log('Message sent: ' + info.message);
        }
      });
    }
  });
}