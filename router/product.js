const route = require('express').Router()
const Product = require('../model/product')

route.get('/', async (req, res) => {
    const products = await Product.find()
    res.send(products)
})

route.post('/', async (req, res) => {
    const product = new Product({
        name : req.body.name,
        price : req.body.price,
        tags : req.body.tags,
        imgurl : req.body.imgurl
    })
    try {
        const savedProduct = await product.save()
        res.send(savedProduct)
    } catch (error) {
        res.status(404).send(error)
    }
})

module.exports = route