const route = require('express').Router()
const Blog = require('../model/blog')

route.get('/', async (req, res) => {
    const blogs = await Blog.find()
    res.send(blogs)
})

route.get('/:url' ,(req,res)=>{
    Blog.findOne({url : req.params.url})
    .populate('author')
    .then(data => {
        // if (data) {
        //     data.googleId = "private",
        //     data.userdata_id.css = "private"
        // }
        res.send(data)
    })
    .catch(err => console.log(err))
})

route.post('/', async (req, res) => {
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
})

route.put('/:url' ,(req,res)=>{
    Blog.findOneAndUpdate({url : req.params.url}, req.body)
    .then(data => {
        res.send("updated sucessful")
    })
    .catch(err => console.log(err))
})

route.delete('/:url' ,(req,res)=>{
    Blog.deleteOne({url : req.params.url})
    .then(data => {
        res.send(data)
    })
    .catch(err => console.log(err))
})

module.exports = route