const route = require('express').Router()
const Blog = require('../model/blog')

route.get('/', async (req, res) => {
    const blogs = await Blog.find()
    res.send(blogs)
})

route.post('/', async (req, res) => {
    const blog = new Blog({
        title : req.body.title,
        body : req.body.body,
        tags : req.body.tags,
        imgurl : req.body.imgurl
    })
    try {
        const savedblog = await blog.save()
        res.send(savedblog)
    } catch (error) {
        res.status(404).send(error)
    }
})

module.exports = route