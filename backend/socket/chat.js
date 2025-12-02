module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("chat socket connected", socket.id);

    socket.on("joinChat", ({ userId, peerId }) => {
      const room = [userId, peerId].sort().join("_");
      socket.join(room);
      socket.room = room;
    });

    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
      const room = [senderId, receiverId].sort().join("_");
      io.to(room).emit("receiveMessage", { senderId, message, time: new Date() });
    });

    socket.on("typing", ({ senderId, receiverId }) => {
      const room = [senderId, receiverId].sort().join("_");
      io.to(room).emit("typing", senderId);
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
      const room = [senderId, receiverId].sort().join("_");
      io.to(room).emit("stopTyping", senderId);
    });

    socket.on("disconnect", () => {
      console.log("chat socket disconnected", socket.id);
    });
  });
};
