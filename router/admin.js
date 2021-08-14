const route = require('express').Router()
const Contact = require('../model/contact')
const User = require('../model/user')
const jwt = require('jsonwebtoken')


const verifytoken = (req, res, next) => {
    const Token = req.headers.token
    jwt.verify(Token, process.env.ACCESSTOKEN, (err, user) => {
        if (err) return res.status(404).send('Invalid User, Please logout and login again bsdk')
        req.user = user
        next()
    });
}

route.get('/contact', verifytoken, async (req, res) => {
    const contact = await Contact.find().sort({ createdAt: -1 })
    res.send(contact)
})

route.get('/user', verifytoken, async (req, res) => {
    const user = await User.find().sort({ createdAt: -1 })
    res.send(user)
})

module.exports = route