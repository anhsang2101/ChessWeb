const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookiepParser = require('cookie-parser');

const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');

dotenv.config();
const app = express();

app.use(cors());
app.use(cookiepParser());
app.use(express.json());

// connect to database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// routes
app.use('/v1/auth', authRoute);
app.use('/v1/user', userRoute);
app.use('/admin', adminRoute);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://172.20.10.2:3000',
    methods: ['GET', 'POST'],
  },
});

let currentSocket = {};
let allRooms = [];
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // current socket
  currentSocket = socket;

  // get all currently rooms
  // const rooms = io.sockets.adapter.rooms;

  // check the current state of players when they reconnecting
  socket.on('handleCurrentState', (data) => {
    const length = allRooms.length;
    if (length > 0) {
      for (let index = 0; index < length; index++) {
        const room = allRooms[index];
        const player1ID = room.player1?.id;
        const player2ID = room.player2?.id;
        if (data.userID === player1ID || data.userID === player2ID) {
          socket.join(room.roomID);

          if (data.page !== 'play online') {
            socket.emit('status', '/play/online');
          } else {
            switch (room.state) {
              case 'waiting':
                socket.emit('status', 'Please wait for another player');
                break;
              case 'occurring':
                io.to(room.roomID).emit('getPlayerInfor');
                break;
              default:
                // when finish game
                break;
            }
          }
          return;
        }
      }
    }
  });

  // on play online
  socket.on('playOnline', (user) => {
    var isEmptyRoom = true;

    const length = allRooms.length;
    if (length > 0) {
      for (let index = 0; index < length; index++) {
        const room = allRooms[index];
        // if the room just have one player who is wating for another one
        if (room.state === 'waiting') {
          socket.join(room.roomID);
          room.state = 'occurring';
          room.player2 = {
            id: user._id,
            name: user.username,
            avatar: 'xyz',
            pieceType: 'black',
            isMyTurn: false,
            remaindTime: {
              minutes: 10,
              seconds: 0,
            },
          };
          // send information of room to the players
          // console.log('infor of room: ', room);
          io.to(room.roomID).emit('inforOfRoom', room);
          io.to(room.roomID).emit('startGame');
          return;
        }
      }
    }

    if (isEmptyRoom) {
      const roomID = uuidv4();
      socket.join(roomID);
      console.log('create new room');
      socket.emit('status', 'Please wait for another player');

      const newRoom = {
        roomID: roomID,
        state: 'waiting',
        player1: {
          id: user._id,
          name: user.username,
          avatar: 'abc',
          pieceType: 'white',
          isMyTurn: true,
          remaindTime: {
            minutes: 10,
            seconds: 0,
          },
        },
      };

      allRooms.push(newRoom);
    }
  });

  // receiving information of player who juse reconnect
  socket.on('playerInfor', (data) => {
    if (Object.keys(data).length > 1) {
      const pieceType = data.pieceType === 'white' ? 'black' : 'white';
      const isMyTurn = !data.isMyTurn;
      const newState = { ...data, pieceType, isMyTurn };
      // console.log('newState: ', newState);
      currentSocket.emit('onReconnect', newState);
    }
  });

  // on move piece
  socket.on('movePiece', (data) => {
    socket.to(data.roomID).emit('movePiece', data);
  });

  // on end game
  socket.on('endGame', (data) => {
    const length = allRooms.length;
    for (let index = 0; index < length; index++) {
      if(allRooms[index].roomID === data.roomID) {
        allRooms[index].state = 'finish';
        break;
      }
    }
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

  // on player offer draw game
  socket.on('offerDrawGame', (data) => {
    socket.to(data.roomID).emit('offerDrawGame', data);
  });

  // on handle draw game
  socket.on('handleDrawGame', (roomID) => {
    io.to(roomID).emit('handleDrawGame');
  });

  // on cancel invite
  socket.on('cancelInvite', (roomID) => {
    socket.to(roomID).emit('cancelInvite');
  });
});

server.listen(3001, () => {
  console.log('SERVER IS RUNNING');
});
