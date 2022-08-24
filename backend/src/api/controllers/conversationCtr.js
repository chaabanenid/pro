const Conversation = require("../models/conversationModelModel");

const conversationCtr = {
  createConversation: async (req, res) => {
    const { senderId } = req.body;
    const { recieverId } = req.body;
    try {
      const newConversation = new Conversation({
        members: [senderId, recieverId],
      });
      const savedConversation = await newConversation.save();
      return res.status(200).json({
        success: true,
        message: "Conversation Created Updated:",
        savedConversation,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
  getconversations: async (req, res) => {
    try {
      const conversation = await Conversation.find({
        members: { $in: [req.user.id] },
      });

      return res.status(200).json({
        success: true,
        message: "Conversation Created Updated:",
        conversation,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
};

module.exports = conversationCtr;
