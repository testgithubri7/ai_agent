const { GoogleGenAI } = require("@google/genai");
const executeTool = require("./toolExecutor");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function runAgent(userMessage) {

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: userMessage,

        config: {
            tools: [
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
            ]
        }
    });

    const candidate =
        response.candidates?.[0];

    const parts =
        candidate?.content?.parts || [];

    const functionCalls =
        parts.filter(
            part => part.functionCall
        );

    if (functionCalls.length === 0) {

        return (
            candidate?.content?.parts?.[0]?.text ||
            "No response from AI"
        );

    }

    const toolResults = [];

    for (const call of functionCalls) {

        const toolName =
            call.functionCall.name;

        console.log(
            "Executing:",
            toolName
        );

        let toolArgs;

        if (toolName === "calculatorTool") {

            toolArgs =
                call.functionCall.args.expression;

        }
        else if (toolName === "weatherTool") {

            toolArgs =
                call.functionCall.args.city;

        }
        else if (toolName === "waterIntakeTool") {

            toolArgs =
                call.functionCall.args.weight;

        }

        const result =
            await executeTool(
                toolName,
                toolArgs
            );

        toolResults.push({
            tool: toolName,
            result
        });

    }

    const finalResponse =
        await ai.models.generateContent({
            model: "gemini-2.5-flash",

            contents: `
User asked:

${userMessage}

Tool results:

${JSON.stringify(toolResults)}

Answer the user naturally.
`
        });

    return (
        finalResponse.candidates?.[0]?.content?.parts?.[0]?.text ||
       "No response from AI"
    );

}

module.exports = runAgent;