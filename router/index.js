const route = require('express').Router()
const cloudinary = require("cloudinary").v2;

route.get('/', (req, res) => {
    res.send("hello")
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

route.post('/upload',(req,res)=>{

    const data = req.files.upload.tempFilePath

    console.log(data)
    // upload image here
    cloudinary.uploader.upload(data)
    .then((result) => {
      // console.log(result)
      res.status(200).send({
        uploaded: "true",
        url : result.url
      });
    })
    .catch((error) => {
      console.log(error)
      res.status(404).send({error});
    });
})
module.exports = route