const express = require("express");
const PORT = 3000;

const server = express()
  .use((req, res) => res.sendFile("/index.html", { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


const io = require("socket.io")(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
      }
});

const names = {};

io.on("connection", (socket)=>{
    socket.on("loggedIn", (userName)=>{
        names[socket.id] = userName;
        
        socket.broadcast.emit("newUser", userName);
    });

    socket.on("message-sent", (msg)=>{
        
        socket.broadcast.emit("message-received", {msg, userName: names[socket.id]});
    });

    socket.on("disconnect", ()=>{
        socket.broadcast.emit("loggedOut", names[socket.id]);
        delete names[socket.id];
    });
});

