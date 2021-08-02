const route = require('express').Router()
const Page = require('../model/page')
const jwt = require('jsonwebtoken')

const verifytoken = (req, res, next) => {
    const Jwt = req.body.jwt
    jwt.verify(Jwt, process.env.ACCESSTOKEN, (err, user) => {
        if (err) return res.status(404).send('Invalid User, Please logout and login again')
        req.user = user
        next()
    });
}
const verifytokenbyparams = (req, res, next) => {
    const Jwt = req.params.token
    jwt.verify(Jwt, process.env.ACCESSTOKEN, (err, user) => {
        if (err) return res.status(404).send('Invalid User, Please logout and login again')
        req.user = user
        next()
    });
}

route.get('/', async (req, res) => {
    const pages = await Page.find().sort({ createdAt: -1 })
    res.send(pages)
})

route.get('/:url', (req, res) => {
    Page.findOne({ url: req.params.url })
        .then(data => {
            res.send(data)
        })
        .catch(err => console.log(err))
})

route.post('/', verifytoken, async (req, res) => {
    if (req.user.user.email === process.env.ADMIN) {
        const page = new Page({
            title: req.body.title,
            descripition: req.body.descripition,
            button: req.body.button,
            videourl: req.body.videourl,
            url: req.body.url,
            body: req.body.body,
            tags: req.body.tags,
            imgurl: req.body.imgurl
        })
        try {
            Page.findOne({ url: page.url })
                .then(async (result) => {
                    if (result) {
                        res.status(400).send('url already taken')
                        return
                    } else {
                        const savedpage = await page.save()
                        res.send(savedpage)
                    }
                })
        } catch (error) {
            res.status(404).send(error)
        }
    } else {
        res.status(404).send('Access Denied')
    }
})

route.put('/:url', verifytoken, (req, res) => {
    if (req.user.user.email === process.env.ADMIN) {
        Page.findOneAndUpdate({ url: req.params.url }, req.body)
            .then(data => {
                res.send("updated sucessful")
            })
            .catch(err => console.log(err))
    } else {
        res.status(404).send('Access Denied')
    }
})

route.delete('/:url/:token', verifytokenbyparams, (req, res) => {
    if (req.user.user.email === process.env.ADMIN) {
        Page.deleteOne({ url: req.params.url })
            .then(data => {
                res.send(data)
            })
            .catch(err => console.log(err))
    } else {
        res.status(404).send('Access Denied')
    }
})

module.exports = route