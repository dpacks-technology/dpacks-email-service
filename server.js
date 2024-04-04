const express = require('express')
const app = express()

// port
const port = 4005;

// routes
const email = require("./routes/email");

// config
const Keys = require("./config/Keys");

//CORS
const cors=require("cors");
const corsOptions ={
    origin: "*",
    credentials:true,
    //access-control-allow-credentials:true
    optionSuccessStatus:200,
}
app.use(cors(corsOptions))

// BodyParser middleware
const bodyParser = require("express");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Connect to MongoDB
app.get('/', (req, res) => {
    res.send('Email Microservice - iTrustLD')
})

// Rotes
app.use("/api/email", email);

// App Listen
app.listen(port, () => {
    console.log(`App started on port: ${port}`)
})