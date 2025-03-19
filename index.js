const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express()
require("dotenv").config();
const port = process.env.PORT || 5000;


// middlewire 
app.use(express.json())


// mongoose connection

mongoose.connect("mongodb://localhost/giftifyDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(res=> {
  console.log("MongoDB connected");
})
.catch(err=>{
  console.log("error from db", err);
})



app.get("/", async (req, res)=>{
  res.send("This is Giftify server")
})

app.listen(port, () => {
  console.log(`Giftify server is running on port : ${port}`);
})