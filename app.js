// IMPORTS
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbConnect = require('./dbConnect');

// SERVER
const app = express();
app.listen(process.env.PORT, err => {
    if(err) 
        console.log(`Server Connection Error: ${err}`);
    else
        console.log(`Listening on Port ${process.env.PORT}`);
});

// DB
dbConnect();

// APP MIDDLEWARE
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

// APP ROUTES MIDDLEWARE
const itemRouter = require('./routes/item');

app.use('/api',itemRouter);


app.get('/', (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/10301892/T1DmDJfL');
})