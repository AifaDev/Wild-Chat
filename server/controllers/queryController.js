import User from "../models/userModel.js";

export const getUser = async (req, res, next) => {
  try {
    if (req.body.username) {
      req.tokenData.username = req.body.username;
    }
    const { username } = req.tokenData;

    const user = await User.findOne({ username });
    if (!user) {
      throw "Error: Username not valid";
    }
    const { displayName, email, avatarImage, _id } = user;
    res.json({ displayName, email, username, avatarImage, id: _id });
  } catch (e) {
    next(e);
  }
};

export const setAvatar = async (req, res, next) => {
  try {
    const { username } = req.tokenData;
    const { avatarImage } = req.body;

    var query = { username };

    User.findOneAndUpdate(
      query,
      { avatarImage },
      { upsert: false },
      function (err) {
        if (err) return res.send(500, { error: err });
        return res.send("Succesfully saved.");
      }
    );
  } catch (e) {
    next(e);
  }
};
export const setDisplayName = async (req, res, next) => {
  try {
    const { username } = req.tokenData;
    const { displayName } = req.body;
    var query = { username };

    User.findOneAndUpdate(
      query,
      { displayName },
      { upsert: false },
      function (err) {
        if (err) return res.send(500, { error: err });
        return res.send("Succesfully saved.");
      }
    );
  } catch (e) {
    next(e);
  }
};
