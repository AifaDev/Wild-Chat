import mongoose from "mongoose";

const MessageSchema = mongoose.Schema({
  messageBody: {
    type: String,
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("Messages", MessageSchema);
