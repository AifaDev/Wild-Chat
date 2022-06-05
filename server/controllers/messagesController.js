import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

export const addMessage = async (req, res, next) => {
  try {
    const { from, to, messageBody } = req.body;
    await Message.create({
      from,
      to,
      messageBody,
    });
    res.send("success");
  } catch (e) {
    next(e);
  }
};

export const getAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    Message.find({
      $or: [
        { from: from, to: to },
        { from: to, to: from },
      ],
    })
      .sort({ createdAt: 1 })
      .exec((err, docs) => {
        if (err) {
          throw err;
        }

        docs = docs.map((e) => {
          return {
            fromMe: e.from.toString() === from,
            message: e.messageBody,
          };
        });
        res.send(docs);
      });
  } catch (e) {
    next(e);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { id } = req.body;
    Message.find({
      $or: [{ from: id }, { to: id }],
    })
      .select("from to")
      .populate({ path: "to", model: User })
      .populate({ path: "from", model: User })
      .sort({ createdAt: 1 })
      .exec(function (err, docs) {
        if (err) {
          throw err;
        }
        const unique = {};
        docs = docs.reverse().flatMap((e) => {
          const { from, to } = e;
          if (from.id === id) {
            if (unique[e.to.id]) {
              return [];
            } else {
              to.password = undefined;
              to.email = undefined;
              unique[to.id] = true;
              return [to];
            }
          } else {
            if (unique[from.id]) {
              return [];
            } else {
              from.password = undefined;
              from.email = undefined;
              unique[from.id] = from.id;
              return [from];
            }
          }
        });

        res.send(docs);
      });
  } catch (e) {
    next(e);
  }
};
