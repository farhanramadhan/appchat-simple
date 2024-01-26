const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origins: "*",
  },
});

app.get("/", (req, res) => {
  console.log("/ Called");
  res.send("<h1>Hey Socket.io</h1>");
});

io.on("connection", (socket) => {
  let token = socket.handshake.auth.token;

  socket.join("myRandomChatRoomId");
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("my message", (msg) => {
    io.emit("my broadcast", `server: ${(msg, token)}`);
  });

  socket.on("join", (roomName) => {
    socket.join(roomName);
  });

  socket.on("message", ({ message, roomName }, callback) => {
    const outgoingMessage = {
      name: token,
      id: token,
      message,
    };

    socket.to(roomName).emit("message", outgoingMessage);
    callback({
      status: "ok",
    });
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
