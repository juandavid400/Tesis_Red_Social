const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = 3000;

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('newMsg', (msg) => {
    console.log(`Emitiendo nuevo mensaje: ${msg.content}`);
    io.emit('newMsg', msg);
  });

});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
