import { Server } from "socket.io";
import express from "express";


const app = express();
const port =3000;

const io = new Server({cors : true});

const NametoSocketId = new Map();
const SockettoName = new Map();

io.on("connecting...",(socket)=>{
    socket.on('join-room',(data)=>{
        const {roomId , Name } = data; 
        console.log('User : ',Name ,"Joinded : ",roomId);
        NametoSocketId.set(Name,socket.id);
        SockettoName.set(socket.id,Name);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-joined',{Name});//send our info to all socket present in the room
        socket.emit("joined-room" , {roomId}); //after room joined 
    });

    socket.on('call-user',(data)=>{
        const {Name , offer} = data;
        const socketId = NametoSocketId.get(Name);
        const from =SockettoName.get(socket.id);
        socket.to(socketId).emit('incoming-call',{from : from ,offer});
    });
});

socket.on('offer', (data) => {
    socket.to(data.roomId).emit('offer', {
      offer: data.offer,
      userId: socket.id
    });
});

socket.on('answer', (data) => {
    socket.to(data.roomId).emit('answer', {
      answer: data.answer,
      userId: socket.id
    });
});

app.listen(port,()=>{
    console.log(`Server is running at ${port}`)
})

io.listen(3001);
