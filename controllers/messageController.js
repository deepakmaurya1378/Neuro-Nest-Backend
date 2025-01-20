const Message = require('../models/Message');
const User = require('../models/User')


const sendMessage = async (req, res) => {
  const { receiverId, message } = req.body;
  try {
    const newMessage = new Message({
      senderId: req.user.id,
      receiverId,
      message,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Unable to send message', error });
  }
};


const getMessages = async (req, res) => {
  const { receiverId } = req.body;
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId },
        { receiverId: req.user.id, senderId: receiverId },
      ],
    }).sort({ createdAt: 1 });

    return res.json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};

const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await Message.aggregate([
      { 
        $match: { $or: [{ senderId: userId }, { receiverId: userId }] } 
      },
      { 
        $group: {
          _id: { $cond: [{ $eq: ["$senderId", userId] }, "$receiverId", "$senderId"] },
          lastMessage: { $last: "$message" },
        },
      },
      { $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "participantInfo",
        },
      },
    ]);

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch chats", error: err });
  }
};


module.exports = { sendMessage, getMessages , getUserChats};
