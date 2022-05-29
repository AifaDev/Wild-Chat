import express from "express";
import cors from "cors";
import mongoose from "mongoose";
const app = express();
import dotenv from "dotenv";
import routerMiddleWare from "./routes/auth.js";
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
