// create the server
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();
connectDB();


app.use(cors());
app.use(express.json());

// we are making a blueprint 

// we are importing the router which we have created in route.js
const chatRoutes = require("./routes/chatRoutes");

// we are saying any route which has /api/chat should be handled by the 
// router which we have created in route.js
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
