import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateAccessToken = (username) => {
  return jwt.sign({ username }, process.env.ACCESS_TOKEN, {
    expiresIn: "24h",
  });
};

export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        message: "Username is incorrect.",
        isSuccess: false,
      });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.json({
        message: "Password is incorrect.",
        isSuccess: false,
      });
    }

    const token = generateAccessToken(username);

    return res.json({
      isSuccess: true,
      token: `Bearer ${token}`,
      user: {
        username,
        avatar: user.avatarImage,
        displayName: user.displayName,
        id: user._id,
      },
    });
  } catch (e) {
    next(e);
  }
};
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const isUsernameTaken = Boolean(await User.findOne({ username }));
    const isEmailTaken = Boolean(await User.findOne({ email }));
    if (isUsernameTaken) {
      return res.json({
        message: "Username is already taken",
        isSuccess: false,
      });
    }
    if (isEmailTaken) {
      return res.json({ message: "Email is already taken", isSuccess: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateAccessToken(username);
    user.token = `Bearer ${token}`;
    user.password = undefined; //For some reason delete user.password is not working
    return res.json({
      isSuccess: true,
      token: `Bearer ${token}`,
      user: {
        username,
        avatar: user.avatarImage,
        displayName: user.displayName,
        id: user._id,
      },
    });
  } catch (e) {
    next(e);
  }
};
