//Nodejs server that reads data from test1.exe and forwards it to the React frontend using Socket.io
const path = require('path');
const readline = require('readline');
const net = require('net');
const spawn = require('child_process').spawn;

const py = spawn(path.join('nirs-reader', 'Test1.exe'), ['test', path.join('nirs-reader', 'DataFiles')]);

readline
  .createInterface({
    input: py.stdout,
    terminal: false,
  })
  .on('line', function (line) {
    console.log(line);
  });

// const express = require('express');
// const app = express();

// const server = require('http').createServer(app);
// server.listen(8080);

// const socket = require('socket.io')(server, {
//   cors: {
//     origin: '*',
//   },
// });

// socket.on('connection', socket => {
//   socket.emit('handshake', {
//     message: 'connected',
//   });

//   const py = spawn(path.join('nirs-reader', 'Test1.exe'), ['test', path.join('nirs-reader', 'DataFiles')]);

//   readline
//     .createInterface({
//       input: py.stdout,
//       terminal: false,
//     })
//     .on('line', function (line) {
//       socket.emit('data', { data: JSON.parse(line) });
//     });
// });
