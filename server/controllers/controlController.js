const express = require('express');
const app = express();
app.use(express.json());

const { rooms } = require('../socket/socketHandler');

const passcontrol = () =>{
   const {roomId,userId,control} = rooms;
   const room = roomsData.find((room) => room.roomId === roomId);
   if(!room){
    console.log("no rooms");
    return;
    
   }
   if (room.control === room.userId) {
    console.log("User already has control.");
    return;
 }
 room.control = userId;
 console.log("control updated")  
}
const releasecontrol =(rooms) =>{
    const {roomId,userId,control} = rooms;
    const room = rooms.find((room) => room.roomId === roomId);
    if (room && room.currentControl === userId) {
        room.currentControl = null;
        console.log('Control released by user:', userId);
    }

}

export default {passcontrol,releasecontrol};