const route = require('express').Router()
const Order = require('../model/order')
const jwt = require('jsonwebtoken')

const verifytoken = (req,res, next) =>{
    const Jwt = req.body.jwt
    jwt.verify(Jwt, process.env.ACCESSTOKEN, (err, user)=>{
        if(err) return res.status(404).send('Invalid User, Please logout and login again')
        req.user = user
        next()
    });
}
const verifytokenbyparams = (req,res, next) =>{
    const Jwt = req.params.token
    jwt.verify(Jwt, process.env.ACCESSTOKEN, (err, user)=>{
        if(err) return res.status(404).send('Invalid User, Please logout and login again')
        req.user = user
        next()
    });
}

route.get('/', async (req, res) => {
    const orders = await Order.find().sort({createdAt: -1})
    .populate('user')
    .populate('product')
    res.send(orders)
})

route.get('/:id' ,(req,res)=>{
    Order.findOne({_id : req.params.id})
    .populate('user')
    .populate('product')
    .then(data => {
        res.send(data)
    })
    .catch(err => console.log(err))
})

route.post('/', async (req, res) => {

    var item = req.body.purchase_units[0].items
    var product_id = item.map(item =>{
        return item.sku
      })

    const order = new Order({
        user : '60a883e6306754cd6a6d5717',
        product : product_id,
        price : req.body.purchase_units[0].amount.value,
        currency_code : req.body.purchase_units[0].amount.currency_code,
        description : req.body.purchase_units[0].description,
        tras_id : req.body.purchase_units[0].payments.captures[0].id,
        create_time : req.body.create_time,
        email_address : req.body.payer.email_address,
        status : req.body.status,
        id : req.body.id,
        
    })
    console.log(order)
    try {
        order.save()
        .then( result =>res.send(result))
        .catch(err => res.send(err))
    } catch (error) {
        res.status(404).send(error)
    }
})

module.exports = route