const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("call-user", (data) => {
    io.to(data.to).emit("incoming-call", { from: socket.id });
  });

  socket.on("answer-call", (data) => {
    io.to(data.to).emit("call-answered", { from: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});