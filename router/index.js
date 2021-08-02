const route = require('express').Router()
const cloudinary = require("cloudinary").v2;
const Message = require('../model/contact');

route.get('/', (req, res) => {
  res.send("hello")
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

route.post('/upload', (req, res) => {

  const data = req.files.upload.tempFilePath

  // console.log(data)
  // upload image here
  cloudinary.uploader.upload(data, {
    folder: "dropship/",
    // public_id: req.files.upload.name
  })
    .then((result) => {
      // console.log(result)
      res.status(200).send({
        uploaded: "true",
        url: result.url
      });
    })
    .catch((error) => {
      console.log(error)
      res.status(404).send({ error });
    });
})

route.post('/contact', async (req, res) => {
  const message = new Message({
    email: req.body.email,
    website: req.body.website,
    name: req.body.name,
    message: req.body.message,
    budget: req.body.budget
  })
  try {
    const savedmess = await message.save()
    res.send(savedmess)
  } catch (error) {
    res.status(404).send(error)
  }
})


module.exports = route