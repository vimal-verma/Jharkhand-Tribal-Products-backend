const route = require('express').Router()
const Product = require('../model/product')
const jwt = require('jsonwebtoken')

const verifytoken = (req, res, next) => {
    const Token = req.headers.token
    jwt.verify(Token, process.env.ACCESSTOKEN, (err, user) => {
        if (err) return res.status(404).send('Invalid User, Please logout and login again')
        req.user = user
        next()
    });
}

route.get('/', async (req, res) => {
    var limit = 100;
    if (req.query.limit) {
        limit = parseInt(req.query.limit)
    }
    const products = await Product.find({ stock: { $gte: 1 } }).sort({ createdAt: -1 }).limit(limit)
    res.send(products)
})

route.get('/:url', (req, res) => {
    Product.findOne({ url: req.params.url })
        .then(data => {
            res.send(data)
        })
        .catch(err => console.log(err))
})

route.post('/', verifytoken, async (req, res) => {
    console.log(req.user.user.email)
    if (req.user.user.email === process.env.ADMIN) {
        const product = new Product({
            name: req.body.name,
            url: req.body.url,
            price: req.body.price,
            stock: req.body.stock,
            tags: req.body.tags,
            features: req.body.features,
            description: req.body.description,
            imgurl: req.body.imgurl
        })
        try {
            Product.findOne({ url: product.url })
                .then(async (result) => {
                    if (result) {
                        res.status(400).send('url already taken')
                        return
                    } else {
                        const savedproduct = await product.save()
                        res.send(savedproduct)
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
        Product.findOneAndUpdate({ url: req.params.url }, req.body)
            .then(data => {
                res.send("updated sucessful")
            })
            .catch(err => console.log(err))
    } else {
        res.status(404).send('Access Denied')
    }
})

route.delete('/:url', verifytoken, (req, res) => {
    if (req.user.user.email === process.env.ADMIN) {
        Product.deleteOne({ url: req.params.url })
            .then(data => {
                res.send(data)
            })
            .catch(err => console.log(err))
    } else {
        res.status(404).send('Access Denied')
    }
})

module.exports = route