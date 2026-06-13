const { GoogleGenAI } = require("@google/genai");
const Conversation = require("../models/Conversation");
const calculatorTool = require("../tools/calculatorTool");



const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const runAgent =
require("../services/agentService");

const chat = async (req, res) => {

    try {

        const { message } = req.body;

        const userId ="user123";

            //fetch if the conversation exists for the user, if not create a new one    

        let conversation =
        await Conversation.findOne({ userId });

            //if no conversation exists, create a new one
        if (!conversation) {

            conversation = new Conversation({
                userId,
                messages: []
            });

        }

        //push the user message to the conversation history
        conversation.messages.push({
            role: "user",
            content: message
        });

            //context window - send last 10 messages to the AI model for better responses

        const recentMessages =
        conversation.messages.slice(-10);

        //convert messages to a format suitable for the AI model
        //javascript to string format like "user: Hello\nassistant: Hi there!" for better context understanding by the model
        const history = recentMessages
        .map(
            msg =>
            `${msg.role}: ${msg.content}`
        )
        .join("\n");

     let assistantReply;

const agentReply =
await runAgent(message);

if(agentReply){

    assistantReply = agentReply;

}
else{

    const response =
    await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents: history
    });

    assistantReply = response.text;

}

        //push the AI response back to the conversation history
        conversation.messages.push({
            role: "assistant",
            content: assistantReply
        });

        //save the updated conversation back to the database so that 
        //if it restarts then also ot is stored in database and can be retrieved later for context  
        await conversation.save();

        res.status(200).json({
            success: true,
            reply: assistantReply
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

module.exports = { chat };