import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {readdirSync} from 'fs';

const morgan = require('morgan');
require('dotenv').config();

const app = express();
const http =  require('http').createServer(app);
const io = require('socket.io')(http, { //immediately run io
    path: '/socket.io',
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
        allowedHeaders: ["content-type"],
    },
});

//db
    mongoose
        .connect(process.env.DATABASE, {}) // don't need to add extra declarations
        .then(() => console.log("DB connected"))
        .catch((error) => console.log("DB Error => ", error));

//middlewares
app.use(express.json({limmit:'5mb'})); //limit is optional
app.use(express.urlencoded({extended: true})); //used for sending data
app.use(cors({
        origin: [process.env.CLIENT_URL],
    })
); //allows api use for any app

// merncamp.com -> react rest
// merncamp.com/api -> rest api
// merncamp.com/socket.io -> socket.io server


// autoloaded routes
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

// socket.io
// io.on("connect", (socket) => {
//     // console.log('SOCKET.IO', socket.id);
//     socket.on('send-message', (message) => {
//         // console.log('Message received', message)
//         // socket.emit('receive-message', message); // only sends message to the user who activates
//         socket.broadcast.emit('receive-message', message); // sends message everyone but the user who activates
//     })
// });

io.on("connect", (socket) => {
    // console.log('SOCKET.IO', socket.id);
    socket.on('new-post', (newPost) => {
        // console.log('socket new post =>', newPost)
        socket.broadcast.emit('new-post', newPost);
    });
});


const port = process.env.PORT || 8000;

http.listen(port, ()=> console.log(`server running on port ${port}`));