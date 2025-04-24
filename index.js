const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 5000;


// middlewire 
app.use(cors())
app.use(express.json())



// giftifyDB
// aClNzHq2JRqU3sj3

//  console.log(process.env.MONGOOSE_URI);
console.log(process.env.MONGOOSE_URI);


// mongoose connection
mongoose.connect(`mongodb+srv://${process.env.USER_NAME}:${process.env.DB_KEY}@cluster0.ttcu5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(res => {
    console.log("MongoDB connected");
  })
  .catch(err => {
    console.log("error from db", err);
  })


// Import Rotues
const giftRoutes = require('./routes/giftRoutes');
const userRoutes = require('./routes/userRoutes')
const cartRoutes = require('./routes/cartRoutes')



// Use Routes
app.use("/giftify/gifts", giftRoutes)
app.use("/giftify/users", userRoutes)
app.use("/giftify/carts", cartRoutes)


// root route:
app.get("/", (req, res) => {
  res.send("Giftify backend is up and running!");
});

// JWT RElated Api
app.post("/giftify/jwt", (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h"
  });
  res.send({ token })

})

// stripe payment apis
app.post('/create-payment-intent', async (req, res) => {
  const { price } = req.body;
  const amount = parseInt(price * 100);
  console.log(amount, 'amount inside the intent');

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    payment_method_types: ['card']
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  })
});


app.listen(port, () => {
  console.log(`Giftify server is running on port : ${port}`);
})