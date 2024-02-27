const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors");
const app = require('./app');

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Allow requests from http://localhost:3001 (your frontend origin)
server.use(cors({
    origin: '*'
}));

server.use(app);



mongoose.connect('mongodb+srv://adeolasoremi5:med@med.hjx0nvu.mongodb.net/node-API?retryWrites=true&w=majority')
.then(()=> {
    console.log('Connected To MongoDB')
    server.listen(3001, () => {
        console.log('Node API is running on Port 3001')
    })
}).catch((e) => {
    console.log(`Mongo Error ===> ${e}`);
})

module.exports = server;