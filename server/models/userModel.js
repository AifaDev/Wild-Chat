import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  displayName: {
    type: String,
    min: 3,
    max: 20,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },

  avatarImage: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Users", userSchema);
