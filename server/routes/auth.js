import { registerUser, loginUser } from "../controllers/userController.js";
import express from "express";
import { validateToken } from "../controllers/validateToken.js";
import { middleValidation } from "../middleware/middleValidation.js";
import {
  getUser,
  setAvatar,
  setDisplayName,
} from "../controllers/queryController.js";
import {
  addMessage,
  getAllMessages,
  getAllUsers,
} from "../controllers/messagesController.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.all("*", middleValidation);
router.post("/addMessage", addMessage);
router.post("/getAllUsers", getAllUsers);
router.post("/getAllMessages", getAllMessages);
router.post("/setDisplayName", setDisplayName);
router.post("/token", validateToken);
router.post("/getUser", getUser);
router.post("/setAvatar", setAvatar);

export default router;
