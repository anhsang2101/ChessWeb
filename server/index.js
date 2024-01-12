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
  }
});

let currentSocket = {};
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // current socket
  currentSocket = socket;
  // console.log("currentSocket before: ",currentSocket.id);
  // get all currently rooms 
  const rooms = io.sockets.adapter.rooms;

  // when players reconnection then their socket will be deleted.
  // This can lead to decrease the number of players in a room although the game still occur.
  // Therefore, we need to create new socket for players who has reconected and provide the previous
  // information for their new socket.

  // rooms.forEach((socketIds, room) => {
  //   // when a player reconnect, 
  //   if (socketIds.size === 2) {
  //     // let new socket participate into created room
  //     socket.join(room);
  //     socketIds.forEach(element => {
  //       if(typeof(element) === "object") {
  //         const lastDisconnect = element.lastDisconnect;
  //         const newSocketId = socket.id;
  //         // set new socket for reconnection player
  //         element[lastDisconnect].socketId = newSocketId;
  //         // console.log("element: ", element);
  //         // io.to(room).emit("inforOfRoom", element);
  //       }
  //     });
  //     // console.log("after: ", socketIds);
  //     io.to(room).emit("getPlayerInfor");
  //     return;
  //   }
  // });

  // on disconnecting
  // socket.on("disconnecting", () => {
  //   // get the rooms that socket belong to
  //   const roomsOfSocket = socket.rooms;

  //   roomsOfSocket.forEach((room) => {
  //     if(room.localeCompare(socket.id) !== 0) {
  //       const roomObject = rooms.get(room);
  //       roomObject.forEach(element => {
  //         // get the infors of room by specify the element has type of object
  //         if(typeof(element) === "object") {
  //           // get socketId of player1
  //           let socketId1 = element.player1.socketId;
  //           // determine the player who has recently dicconnected by compare 
  //           // the disconnected player's socketId with socketIds in room
  //           const lastDisconnect = (socket.id.localeCompare(socketId1) === 0) ? "player1" : "player2";
  //           element.lastDisconnect = lastDisconnect;
  //           return;
  //         } 
  //       })
  //     }
  //   })
  // })

  // when receive player's information
  socket.on("playerInfor", (data) => {  
    // when new socket connect, we send "getInforPlayer" to all sockets (players) in room.
    // since the new socket doesn't has roomID so we can use this feature to eliminate
    // the request on this socket.
    if(data.roomID !== "") {
      console.log(socket.id, " received data");
      // console.log("data: ", data);
      const roomsOfSocket = socket.rooms;
  
      roomsOfSocket.forEach((room) => {
        if(room.localeCompare(socket.id) !== 0) {
          const roomObject = rooms.get(room);
          roomObject.forEach(element => {
            // get the infors of room by specify the element has type of object
            if(typeof(element) === "object") {
              // console.log("element: ", element);
              const pieceType = (data.pieceType === "white") ? "black" : "white";
              const isMyTurn = !data.isMyTurn;
              // update new socketId for reconnect player
              const inforOfRoom = data.inforOfRoom;
              const disconnectedPlayer = element.lastDisconnect;
              inforOfRoom.lastDisconnect = disconnectedPlayer;
              inforOfRoom[disconnectedPlayer].socketId = currentSocket.id;

              const newState = {...data,pieceType, isMyTurn};
              // console.log("currentSocket: ", currentSocket.id);
              // console.log("new state: ",newState);
              currentSocket.emit("onReconnect", newState);
              return;
            } 
          })
        }
      })
    }
  });

  // on play online
  socket.on('playOnline', () => {
    // var rooms = io.sockets.adapter.rooms;
    // console.log('before: ', rooms);

    var isEmptyRoom = true;
    rooms.forEach((socketIds, room) => {
      // because whenever each client connect to server, it will automate create a new room (the room ID and the client's socket ID are the same)
      // so we have to compare the room ID and the client's socket ID.

      // If they equal(roomID == socketID), it means that no game room is created. So we create new game room and the player has to wait for another one.

      // Otherwise, if there is an available game room(roomID != socketID), the player can join this room and start game.
      // Note that, if there is an available game room but it already contains two players. So this client has to create new room and wait for another one.

      const socketId = [...socketIds][0];
      // console.log(socketId);
      if ((socketId.localeCompare(room) !== 0) & (socketIds.size === 2)) {
        socket.join(room);
        io.to(room).emit('startGame');

        // add infor of another player
        let inforRoom = [...socketIds][1];
        const socketId = socket.id;
        inforRoom.player2 = {
          socketId: socketId,
          name: 'Godfather',
          avater: 'xyz',
          pieceType: 'black',
          isMyTurn: false,
        };

        io.to(room).emit('inforOfRoom', inforRoom);
        isEmptyRoom = false;
        // console.log('after: ', rooms.get(room));
        return;
      }
    });

    if (isEmptyRoom) {
      const roomID = uuidv4();
      console.log('create new room');
      socket.join(roomID);
      socket.emit('status', 'please wait for another player...');

      const valueOfSet = rooms.get(roomID);
      const socketId = socket.id;
      const inforRoom = {
        roomID: roomID,
        lastDisconnect: null,
        player1: {
          socketId: socketId,
          name: 'son',
          avatar: 'abc',
          pieceType: 'white',
          isMyTurn: true,
        },
      };
      valueOfSet.add(inforRoom);
    }
  });

  // on move piece
  socket.on('movePiece', (data) => {
    socket.to(data.roomID).emit('movePiece', data);
  });

  // on end game
  socket.on('endGame', (data) => {
    socket.to(data.roomID).emit('endGame', data);
  });

  // on reset game
  socket.on('resetGame', (data) => {
    socket.to(data.roomID).emit('resetGame', data);
  });

  // on handle reset game
  socket.on('handleResetGame', (roomID) => {
    socket.to(roomID).emit('handleResetGame');
  });

  // on cancel invite
  socket.on("cancelInvite", (roomID) => {
    socket.to(roomID).emit("cancelInvite");
  })

});

server.listen(3001, () => {
  console.log('SERVER IS RUNNING');
});
