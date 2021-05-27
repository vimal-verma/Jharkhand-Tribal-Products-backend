const route = require('express').Router()
// const cloudinary = require("cloudinary").v2;

route.get('/', (req, res) => {
    res.send("hello")
})

// cloudinary.config({
//     cloud_name: "name",
//     api_key: "key",
//     api_secret: "secret"
//   });

// route.post('/upload',(req,res)=>{
//   console.log(req.files.file)

//     const data = req.files.file

//     console.log(data)
//     // upload image here
//     cloudinary.uploader.upload(data)
//     .then((result) => {
//       console.log(result)
//       res.status(200).send({
//         uploaded: "true",
//         url : result
//       });
//     })
//     .catch((error) => {
//       console.log(error)
//       res.status(404).send({error});
//     });
// })
module.exports = route