import express from "express";
import cors from "cors";
import mongoose from "mongoose";
const app = express();
import dotenv from "dotenv";
import routerMiddleWare from "./routes/auth.js";
import { Server as socket } from "socket.io";
dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/api/auth", routerMiddleWare);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

const io = new socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-message", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("message-recieve", data.message);
    }
  });
});
