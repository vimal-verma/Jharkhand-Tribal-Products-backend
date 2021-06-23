const route = require('express').Router()
var fs = require('fs');
var {transporter} = require('../utils/email')
var ejs = require("ejs");

route.post('/newproduct' , async (req,res )=>{

    ejs.renderFile(__dirname + "/../public/newproduct.ejs", { user:req.body.user, product:req.body.product }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mainOptions = {
                from: '"Admin" letskhabar@gmail.com',
                to: req.body.email,
                subject: `Hi ${req.body.user}!, We have launch new product`,
                html: data
            };

            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                    res.status(404).send(err.message)
                } else {
                    res.send('Message sent: ' + info.response);
                }
            });
        }
    });
})

route.post('/productready' , async (req,res )=>{

    ejs.renderFile(__dirname + "/../public/productready.ejs", { user:req.body.user, product:req.body.product }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mainOptions = {
                from: '"Admin" letskhabar@gmail.com',
                to: req.body.email,
                subject: `Hi ${req.body.user}!, We have launch new product`,
                html: data
            };

            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                    res.status(404).send(err.message)
                } else {
                    res.send('Message sent: ' + info.response);
                }
            });
        }
    });
})



module.exports = route