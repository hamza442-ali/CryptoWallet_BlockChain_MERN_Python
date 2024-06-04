
const express = require("express");
// const upload= require("express-fileupload");
const app= express();
const mongoose= require("mongoose");
const cors= require("cors");
const bodyParser = require('body-parser');
require('dotenv').config();
// const jwt = require('jsonwebtoken');

const userRoutes = require ("./routes/signupRoute")
const transactionRoutes = require("./routes/transactioRoute")



const port= process.env.PORT ||  5001;


//middlewarenp
app.use(cors());
app.use(bodyParser.json());
// app.use(upload());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/user', userRoutes)
app.use('/transaction', transactionRoutes)



// Connect to MongoDB
mongoose.connect(process.env.ATLAS_URI).then(() =>{

        console.log("connected to mongoDB ");

}) .catch((error)=>{

    console.log("error connecting to mongoDB: ", error)
})


app.listen(port, ()=>{

    console.log(`Server listening on port ${port}`)
}); 