const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express()
require("dotenv").config();
const port = process.env.PORT || 5000;


// middlewire 
app.use(cors())
app.use(express.json())


// giftifyDB
// aClNzHq2JRqU3sj3

//  console.log(process.env.MONGOOSE_URI);


// mongoose connection
mongoose.connect(`mongodb+srv://${process.env.USER_NAME}:${process.env.DB_KEY}@cluster0.ttcu5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(res=> {
  console.log("MongoDB connected");
})
.catch(err=>{
  console.log("error from db", err);
})


// Import Rotues
const giftRoutes = require('./routes/giftRoutes')



// Use Routes
app.use("/giftify/gifts", giftRoutes)



app.listen(port, () => {
  console.log(`Giftify server is running on port : ${port}`);
})