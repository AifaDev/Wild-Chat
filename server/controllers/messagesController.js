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

export const getAllUsers = async (req, res, next) => {
  try {
    const { id } = req.body;
    const messages = await Message.find({
      $or: [{ from: id }, { to: id }],
      // $or: [
      //   { from: "6297200c0d20b44461178097", to: "629660e34e160cd6910fa58e" },
      //   { from: "629660e34e160cd6910fa58e", to: "6297200c0d20b44461178097" },
      // ],
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

    // filtered = filtered.filter((e) => {
    //   if (unique[e.username]) {
    //     return false;
    //   } else {
    //     console.log(e.username);
    //     unique[e.username] = true;
    //     return unique[e.username];
    //   }
    // });
    // res.send(filtered);
  } catch (e) {
    next(e);
  }
};
