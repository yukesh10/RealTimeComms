import express from 'express';
import {createServer} from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import 'dotenv/config';

import userRoutes from './routes/userRoutes.js';
import FriendRoutes from './routes/protectedRoutes/friendRoutes.js';

const app = express();

const server = createServer(app);
app.use(cors());
app.use(express.json());

app.use('/auth', userRoutes);
app.use('/friend', FriendRoutes);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});

let users = []

io.on('connect', (socket) => {
    console.log(socket.id);

    socket.on('profile', (profile) => {
        profile['socketId'] = socket.id;
        users.push(profile);
    })

    socket.on('sendMessage', ({message, to}) => {
        console.log(message, to);

        const toSocketId = users.filter(user => user['userId'] == to)[0];
        console.log(toSocketId);

        io.to(toSocketId).emit('message', {text: message});
    })

})


const port = process.env.PORT || 5000;
server.listen(port, () => {

    console.log(`Server started in port ${port}`)
    mongoose.connect(process.env.MONGO_URL, () => {
        console.log('Connected to MongoDB');
    });
})