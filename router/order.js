const route = require('express').Router()
const Order = require('../model/order')
const jwt = require('jsonwebtoken')


const verifytoken = (req,res, next) =>{
    const Token = req.headers.token
    jwt.verify(Token, process.env.ACCESSTOKEN, (err, user)=>{
        if(err) return res.status(404).send('Invalid User, Please logout and login again')
        req.user = user
        next()
    });
}

route.get('/',verifytoken, async (req, res) => {
    if (req.user.user.email === process.env.ADMIN) {
        const orders = await Order.find().sort({createdAt: -1})
        .populate('user')
        .populate('product')
        res.send(orders)
    } else {
        res.status(404).send('Access Denied')
    }
})

route.get('/user', verifytoken ,(req,res)=>{
    Order.find({user : req.user.user._id})
    .populate('user')
    .populate('product')
    .then(data => {
        res.send(data)
    })
    .catch(err => console.log(err))
})

const verifytoken_order = (req,res, next) =>{
    const Token = req.headers.token
    jwt.verify(Token, process.env.ACCESSTOKEN, (err, user)=>{
        if(err) {
            var item = req.body.purchase_units[0].items
            var product_id = item.map(item =>{
                return item.sku
            })

            const order = new Order({
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
                .then( result => {
                    return res.status(404).send('Someting went Wrong, Invalid User')
                })
                .catch(err => {
                    return res.status(404).send(err)
                })
            } catch (error) {
                return res.status(404).send(error)
            }
        }
        else{
            req.user = user
            next()
        }
    });
}

route.post('/', verifytoken_order, async (req, res) => {

    var item = req.body.purchase_units[0].items
    var product_id = item.map(item =>{
        return item.sku
      })

    const order = new Order({
        user : req.user.user._id,
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