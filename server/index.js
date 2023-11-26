const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('playingnow', () => {

    var rooms = io.sockets.adapter.rooms;
    // console.log("before roos",rooms);

    var isEmptyRoom = true;
    rooms.forEach((socketIds, room) => {

      // because whenever each client connect to server, it will automate create a new room (the room ID and the client's socket ID are the same)
      // so we have to compare the room ID and the client's socket ID.

      // If they equal(roomID == socketID), it means that no game room is created. So we create new game room and the player has to wait for another one.

      // Otherwise, if there is an available game room(roomID != socketID), the player can join this room and start game.
      // Note that, if there is an available game room but it already contains two players. So this client has to create new room and wait for another one.
      if(!socketIds.has(room) & socketIds.size === 1) {
        socket.join(room);
        io.to(room).emit("start game");

        const configGame = {
          boardOrientation: "black"
        }
        socket.emit("config game", configGame);
        
        console.log('start game');
        isEmptyRoom = false;
        return;
      }
    });

    if(isEmptyRoom) {
      const roomID = uuidv4();
      console.log('create new room');
      socket.join(roomID);
      socket.emit('status', "please wait for another player...");
    }

  });
});

server.listen(3001, () => {
  console.log('SERVER IS RUNNING');
});
