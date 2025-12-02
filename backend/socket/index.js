const chat = require('./chat');

module.exports = function(io) {
  // chat handlers
  chat(io);

  io.on('connection', socket => {
    console.log('socket connected', socket.id);

    socket.on('register', ({ userId }) => {
      socket.userId = userId;
      if (userId) socket.join(userId);
    });

    socket.on('call-offer', ({ to, offer, from }) => {
      io.to(to).emit('call-offer', { offer, from });
    });

    socket.on('call-answer', ({ to, answer, from }) => {
      io.to(to).emit('call-answer', { answer, from });
    });

    socket.on('ice-candidate', ({ to, candidate }) => {
      io.to(to).emit('ice-candidate', { candidate });
    });

    socket.on('notify', ({ to, payload }) => {
      io.to(to).emit('notification', payload);
    });

    socket.on("join-call", (room) => {
      socket.join(room);
    });

    socket.on("offer", (offer, room) => {
      socket.to(room).emit("offer", offer);
    });

    socket.on("answer", (answer, room) => {
      socket.to(room).emit("answer", answer);
    });

    socket.on("candidate", (candidate, room) => {
      socket.to(room).emit("candidate", candidate);
    });

    socket.on('disconnect', () => {
      // cleanup if necessary
    });
  });
};
