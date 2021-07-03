const route = require('express').Router()
const Blog = require('../model/blog')
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
    var limit = 100;
    if (req.query.limit) {
        limit = parseInt(req.query.limit)
    }
    const blogs = await Blog.find().sort({createdAt: -1}).limit(limit)
    res.send(blogs)
})

route.get('/:url' ,(req,res)=>{
    Blog.findOne({url : req.params.url})
    .populate('author')
    .then(data => {
        res.send(data)
    })
    .catch(err => console.log(err))
})

route.post('/', verifytoken, async (req, res) => {
    if (req.user.user.email === process.env.ADMIN) {
        const blog = new Blog({
            title : req.body.title,
            url : req.body.url,
            body : req.body.body,
            tags : req.body.tags,
            category : req.body.category,
            author : req.body.author,
            imgurl : req.body.imgurl
        })
        try {
            Blog.findOne({url : blog.url})
            .then( async(result) =>{
                if (result) {
                    res.status(400).send('url already taken')
                    return
                } else {
                    const savedblog = await blog.save()
                    res.send(savedblog)
                }
            })
        } catch (error) {
            res.status(404).send(error)
        }
    } else {
        res.status(404).send('Access Denied')
    }
})

route.put('/:url', verifytoken, (req,res)=>{
    if (req.user.user.email === process.env.ADMIN) {
        Blog.findOneAndUpdate({url : req.params.url}, req.body)
        .then(data => {
            res.send("updated sucessful")
        })
        .catch(err => console.log(err))
    } else {
        res.status(404).send('Access Denied')
    }
})

route.delete('/:url/:token', verifytokenbyparams, (req,res)=>{
    if (req.user.user.email === process.env.ADMIN) {
        Blog.deleteOne({url : req.params.url})
        .then(data => {
            res.send(data)
        })
        .catch(err => console.log(err))
    } else {
        res.status(404).send('Access Denied')
    }
})

module.exports = route