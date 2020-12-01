const express = require('express');
const socket = require('socket.io');

let tasks = [];

const app = express();

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateTask', tasks);
    socket.on('addTask', (task) => {
      tasks.push(task);
      socket.broadcast.emit('updateTask', tasks);
    });
    socket.on('removeTask', (taskId) => {
        tasks = tasks.filter(task => task.id != taskId);
        socket.broadcast.emit('updateTask', tasks);
      });
});
