const { GoogleGenAI } = require("@google/genai");
const executeTool = require("./toolExecutor");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const toolsConfig = [
    {
        functionDeclarations: [
            {
                name: "calculatorTool",
                description: "Perform mathematical calculations",

                parameters: {
                    type: "OBJECT",

                    properties: {
                        expression: {
                            type: "STRING",
                            description: "Mathematical expression to calculate"
                        }
                    },

                    required: ["expression"]
                }
            },

            {
                name: "weatherTool",
                description: "Get weather information for a city",

                parameters: {
                    type: "OBJECT",

                    properties: {
                        city: {
                            type: "STRING",
                            description: "City name"
                        }
                    },

                    required: ["city"]
                }
            },

            {
                name: "waterIntakeTool",
                description: "Calculate daily water intake in liters based on body weight",

                parameters: {
                    type: "OBJECT",

                    properties: {
                        weight: {
                            type: "NUMBER",
                            description: "Weight in kilograms"
                        }
                    },

                    required: ["weight"]
                }
            }
        ]
    }
];

async function runAgent(userMessage) {

    const conversation = [
        {
            role: "user",
            parts: [
                {
                    text: userMessage
                }
            ]
        }
    ];

    while (true) {

        const response =
            await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: conversation,
                config: {
                    tools: toolsConfig
                }
            });

        const candidate =
            response.candidates?.[0];

        const parts =
            candidate?.content?.parts || [];

        const functionCallPart =
            parts.find(
                part => part.functionCall
            );

        if (!functionCallPart) {

            return (
                candidate?.content?.parts?.[0]?.text ||
                "No response from AI"
            );

        }

        const toolName =
            functionCallPart.functionCall.name;

        console.log(
            "Executing:",
            toolName
        );

        let toolArgs;

        if (toolName === "calculatorTool") {

            toolArgs =
                functionCallPart.functionCall.args.expression;

        }

        else if (toolName === "weatherTool") {

            toolArgs =
                functionCallPart.functionCall.args.city;

        }

        else if (toolName === "waterIntakeTool") {

            toolArgs =
                functionCallPart.functionCall.args.weight;

        }

        const toolResult =
            await executeTool(
                toolName,
                toolArgs
            );

        console.log(
            "Tool Result:",
            toolResult
        );

        conversation.push({
            role: "model",
            parts: [
                {
                    functionCall:
                        functionCallPart.functionCall
                }
            ]
        });

        conversation.push({
            role: "user",
            parts: [
                {
                    text:
                        JSON.stringify(toolResult)
                }
            ]
        });

    }

}

module.exports = runAgent;