
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
var cors = require('cors')
const fileUpload = require('express-fileupload');

// mongodb setup
const dbURI = process.env.DB_URL;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => console.log('connected to db'))
  .catch(err => console.log(err));

const app= express();
app.use(express.json())
app.use(cors())
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

app.use('/', require('./router/'))
app.use('/auth', require('./router/auth'))
app.use('/blog', require('./router/blog'))
app.use('/page', require('./router/page'))
app.use('/product', require('./router/product'))
app.use('/email', require('./router/email'))

const port = process.env.PORT || 5000
app.listen(port, console.log(`app is running on port ${port}, go to http://localhost:${port}`))