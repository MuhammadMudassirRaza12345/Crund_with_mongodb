//  import express from 'express';
import express, { response } from 'express';
 import cors from "cors";
//  const mongoose = require('mongoose');
import   mongoose  from  "mongoose" ;     //new way in es6
// cors is used to allow server permission
const app = express()
app.use(express.json())
app.use(cors());  

// mongoose.connect("mongodb+srv://mudassir:mudassir786110@cluster0.6sgt9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

//// mongodb connection code /////////////////////////////////////////////////////////////////////////////////////////////
let dbURI = "mongodb+srv://mudassir:mudassir786110@cluster0.6sgt9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// let dbURI = 'mongodb://localhost/mydatabase';
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
  console.log("Mongoose is connected");
  // process.exit(1);
});

mongoose.connection.on('disconnected', function () {//disconnected
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
  console.log('Mongoose connection error: ', err);
  process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
  console.log("app is terminating");
  mongoose.connection.close(function () {
      console.log('Mongoose default connection closed');
      process.exit(0);
  });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////

const postSchema = new mongoose.Schema({
  "text": String,
  "createdOn": { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', postSchema);

  
//--------get-------------
 
app.get('/post/:id', (req, res) => {
  Post.findOne({ _id: req.params.id }, (err, data) => {
      if (!err) {
          res.send(data);
      } else {
          res.status(500).send("something went wrong")
      }
  })
})  //aik post ae gi




app.get('/posts', (req, res) => {
  Post.find({}, (err, data) => {
      if (!err) {
          res.send(data);
      } else {
          res.status(500).send("something went wrong")
      }
  })
})
     ///aik sa ziada posts ae gi



//----------post------------
app.post('/post', (req, res) => {
    
  if (!req.body.text || req.body.text.length > 200) {
    res.status(400).send(`text is required in json body (max 200 chars), e.g: { "text" : "what is in your mind" }`);
    return;
}

let newPost = new Post({
    text: req.body.text
});

newPost.save((err, saved) => {
    if (!err) {
        res.send("your post is saved 🥳");
    } else {
        res.status(500).send("some thing went wrong, please try later");
    }
})



})





// app.put('/post', (req, res) => {
//   res.send()
// })
app.put('/post/:id', (req, res) => {

  Post.findOneAndUpdate(
      { _id: req.params.id },
      { text: req.body.text },
      {},
      (err, data) => {
          if (!err) {
              res.send("updated");
          } else {
              res.status(500).send("something went wrong")
          }
      }
  );
})

//for del one post
app.delete('/post/:id', (req, res) => {
  Post.deleteOne(
      { _id: req.params.id },
      {},
      (err, data) => {
          if (!err) {
              res.send("deleted")
          } else {
              res.status(500).send("something went wrong")
          }
      });
})

 

app.delete('/posts', (req, res) => {
  posts = [];
  res.send("deleted everything")
})

// app.delete('/post', (req, res) => {
//   res.send()
// })




// const port = 3000
const PORT =process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`your server is running 😊😊  on port ${PORT}`)
})

// cors npm
// https://www.npmjs.com/package/cors

// https://devcenter.heroku.com/articles/getting-started-with-nodejs

//mongoose
// https://mongoosejs.com/docs/index.html
// mongodb atlas
// https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_emea_pakistan_search_core_brand_atlas_desktop&utm_term=mongodb%20atlas&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624545&adgroup=115749719183&gclid=Cj0KCQiA3fiPBhCCARIsAFQ8QzXFcemplbjEdincShXtcmyv_3YE72MIYg6GOU_-laFioucWwjcxSckaAraTEALw_wcB