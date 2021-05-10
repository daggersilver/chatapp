const express = require("express");
const PORT = process.env.PORT || 3000;

const server = express()
  .use(express.static("public"))  
  .use((req, res) => res.sendFile("/index.html", { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


const socketIO = require("socket.io");

const io = socketIO(server);

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

