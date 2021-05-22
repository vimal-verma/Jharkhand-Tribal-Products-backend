const route = require('express').Router()
const Product = require('../model/product')

route.get('/', async (req, res) => {
    const products = await Product.find()
    res.send(products)
})

route.get('/:url' ,(req,res)=>{
    Product.findOne({url : req.params.url})
    .then(data => {
        res.send(data)
    })
    .catch(err => console.log(err))
})

route.post('/', async (req, res) => {
    const product = new Product({
        name : req.body.name,
        url : req.body.url,
        price : req.body.price,
        tags : req.body.tags,
        features : req.body.features,
        description : req.body.description,
        imgurl : req.body.imgurl
    })
    try {
        Product.findOne({url : product.url})
        .then( async(result) =>{
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
})

module.exports = route