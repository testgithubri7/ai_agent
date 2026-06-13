const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    userId: String,

    messages: [
        {
            role: String,
            content: String
        }
    ]
});

module.exports = mongoose.model(
    "Conversation",
    conversationSchema
);