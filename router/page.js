const route = require('express').Router()
const Page = require('../model/page')

route.get('/', async (req, res) => {
    const pages = await Page.find()
    res.send(pages)
})

route.get('/:url' ,(req,res)=>{
    Page.findOne({url : req.params.url})
    .then(data => {
        res.send(data)
    })
    .catch(err => console.log(err))
})

route.post('/', async (req, res) => {
    const page = new Page({
        title : req.body.title,
        url : req.body.url,
        body : req.body.body,
        tags : req.body.tags,
        imgurl : req.body.imgurl
    })
    try {
        Page.findOne({url : page.url})
        .then( async(result) =>{
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
})

route.put('/:url' ,(req,res)=>{
    Page.findOneAndUpdate({url : req.params.url}, req.body)
    .then(data => {
        res.send("updated sucessful")
    })
    .catch(err => console.log(err))
})

route.delete('/:url' ,(req,res)=>{
    Page.deleteOne({url : req.params.url})
    .then(data => {
        res.send(data)
    })
    .catch(err => console.log(err))
})

module.exports = route