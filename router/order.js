const route = require('express').Router()
const Order = require('../model/order')
const Product = require('../model/product')
const jwt = require('jsonwebtoken')
const { sendOrderEmail } = require('../utils/email')


const verifytoken = (req, res, next) => {
    const Token = req.headers.token
    jwt.verify(Token, process.env.ACCESSTOKEN, (err, user) => {
        if (err) return res.status(404).send('Invalid User, Please logout and login again')
        req.user = user
        next()
    });
}

route.get('/', verifytoken, async (req, res) => {
    if (req.user.user.email === process.env.ADMIN) {
        const orders = await Order.find().sort({ createdAt: -1 })
            .populate('user')
            .populate('product')
        res.send(orders)
    } else {
        res.status(404).send('Access Denied')
    }
})

route.get('/user', verifytoken, (req, res) => {
    Order.find({ user: req.user.user._id })
        .then(data => {
            res.send(data)
        })
        .catch(err => console.log(err))
})

route.get('/id/:id', async (req, res) => {
    const orders = await Order.findOne({ _id: req.params.id })
        .populate('user')
        .populate('product')
    res.send(orders)
})

route.post('/carts', async (req, res) => {
    var Ids = req.body

    const product = await Product.find({ _id: Ids, stock: { $gte: 1 } }, 'price')
    res.send(product)
})

const verifytoken_order = (req, res, next) => {
    const Token = req.headers.token
    jwt.verify(Token, process.env.ACCESSTOKEN, (err, user) => {
        if (err) {
            var item = req.body.purchase_units[0].items
            var product_id = item.map(item => {
                return item.sku
            })

            const order = new Order({
                product: product_id,
                price: req.body.purchase_units[0].amount.value,
                currency_code: req.body.purchase_units[0].amount.currency_code,
                description: req.body.purchase_units[0].description,
                tras_id: req.body.purchase_units[0].payments.captures[0].id,
                create_time: req.body.create_time,
                email_address: req.body.payer.email_address,
                status: req.body.status,
                id: req.body.id,
            })
            console.log(order)
            try {
                order.save()
                    .then(result => {
                        return res.status(404).send('Someting went Wrong, Invalid User')
                    })
                    .catch(err => {
                        return res.status(404).send(err)
                    })
            } catch (error) {
                return res.status(404).send(error)
            }
        }
        else {
            req.user = user
            next()
        }
    });
}

route.post('/', verifytoken_order, async (req, res) => {

    var item = req.body.purchase_units[0].items
    var product_id = item.map(item => {
        return item.sku
    })

    const order = new Order({
        user: req.user.user._id,
        product: product_id,
        price: req.body.purchase_units[0].amount.value,
        currency_code: req.body.purchase_units[0].amount.currency_code,
        description: req.body.purchase_units[0].description,
        tras_id: req.body.purchase_units[0].payments.captures[0].id,
        create_time: req.body.create_time,
        email_address: req.body.payer.email_address,
        status: req.body.status,
        id: req.body.id,

    })
    try {
        order.save()
            .then(result => {
                Product.updateMany({ _id: product_id }, {
                    $inc: { stock: -1 }
                })
                    .then(savedorder => {
                        res.send(result)
                        var productdetails = `you have order a product of value ${order.price} ${order.currency_code}, tras_id is ${order.tras_id} `
                        sendOrderEmail(req.user.user.name, req.user.user.email, productdetails)
                    })
                    .catch(err => res.send(err))
            })
            .catch(err => res.send(err))
    } catch (error) {
        res.status(404).send(error)
    }
})

module.exports = route