const route = require('express').Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user')
var fs = require('fs');
var {transporter} = require('../utils/email')
var nodemailer = require("nodemailer");
var ejs = require("ejs");

route.get('/', (req, res) => {
    res.send("hello")
})

route.post('/register', async (req,res )=>{
    const user = new User({
        email : req.body.email,
        password : req.body.password,
        name : req.body.name,
        imgurl : req.body.imgurl
    })

    if(user.password.length < 5){
        return res.status(404).send('password length be greater than 4')
    }

    const finduser = await User.findOne({email : user.email})
    if(finduser){
        return res.status(404).send('email already registered')
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(user.password, salt)
    user.password = hashpassword

    try {
        const saveduser = await user.save()
        const accesstoken = jwt.sign({ user: saveduser }, process.env.ACCESSTOKEN)
        res.header('auth-token', accesstoken).send(accesstoken)
    } catch (error) {
        res.status(404).send(error)
    }
})

route.post('/login' , async (req,res )=>{
    const user = await User.findOne({email : req.body.email})

    if(user){
        const validpass = await bcrypt.compare(req.body.password, user.password)
        if (validpass) {
            const accesstoken = jwt.sign({user}, process.env.ACCESSTOKEN)
            res.header('auth-token', accesstoken).send(accesstoken)
        } else {
            res.status(400).send('user credentials not match')
        }
    }else{
        res.status(400).send('user not found, please register')
    }
})

route.post('/changepassword' , async (req,res )=>{
    const user = await User.findOne({email : req.body.email})
    if(user){
        const validpass = await bcrypt.compare(req.body.password, user.password)
        if (validpass) {
            
            const salt = await bcrypt.genSalt(10);
            const hashpassword = await bcrypt.hash(req.body.newpassword, salt)
            const newpassword = ({password : hashpassword})

            User.findOneAndUpdate({email : req.body.email}, newpassword)
            .then(data => {
                const accesstoken = jwt.sign({user : data}, process.env.ACCESSTOKEN)
                res.header('auth-token', accesstoken).send(accesstoken)
            })
            .catch(err => console.log(err))
        } else {
            res.status(400).send('user credentials not match')
        }
    }else{
        res.status(400).send('user not found, please register')
    }
})

route.post('/resetpassword' , async (req,res )=>{
    const user = await User.findOne({email : req.body.email})
    if(user){
        const resetToken = jwt.sign({email: user.email}, process.env.RESETTOKEN,{
            expiresIn: 1800 // 30 minutes
        })
        const url = `${process.env.CLIENT_URL}/resetpassword/${resetToken}`

        ejs.renderFile(__dirname + "/../public/resetpassword.ejs", { user: user.name, url }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                var mainOptions = {
                    from: '"Developer" letskhabar@gmail.com',
                    to: user.email,
                    subject: `Hi ${user.name}!, You have requested to reset your password`,
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
    }else{
        res.status(400).send('user not found, please register')
    }
})

route.post('/resetpassword/:resettoken' , async (req,res )=>{
    if(req.body.password.length < 5){
        return res.status(404).send('password length be greater than 4')
    }

    jwt.verify(req.params.resettoken, process.env.RESETTOKEN, async (err, user)=>{
        if(err) return res.status(404).send('Invalid Url, Please try again')
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(req.body.password, salt)
        const newpassword = ({password : hashpassword})
        User.findOneAndUpdate({email : user.email}, newpassword)
        .then(data => {
            const accesstoken = jwt.sign({user : data}, process.env.ACCESSTOKEN)
            res.header('auth-token', accesstoken).send(accesstoken)
        })
        .catch(err => console.log(err))
    });
})
module.exports = route