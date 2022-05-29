import { registerUser, loginUser } from "../controllers/userController.js";
import express from "express";
import { validateToken } from "../controllers/validateToken.js";
import { middleValidation } from "../middleware/middleValidation.js";
import {
  getUser,
  setAvatar,
  setDisplayName,
} from "../controllers/queryController.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.all("*", middleValidation);
router.post("/token", validateToken);
router.get("/getUser", getUser);
router.post("/setAvatar", setAvatar);
router.post("/setDisplayName", setDisplayName);

export default router;
