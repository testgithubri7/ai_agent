const dotenv = require("dotenv");

// Load environment variables FIRST
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const {
    buildVectorStore
} = require("./services/vectorStore");

const chatRoutes =
    require("./routes/chatRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    "/api/chat",
    chatRoutes
);

const PORT =
    process.env.PORT || 5000;

async function startServer() {

    try {

        await connectDB();

        console.log(
            "\nBuilding Vector Store..."
        );

        await buildVectorStore();

        app.listen(
            PORT,
            () => {

                console.log(
                    `\nServer is running on port ${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "Startup Error:",
            error
        );

    }

}

startServer();