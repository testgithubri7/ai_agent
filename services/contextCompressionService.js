const { GoogleGenAI } =
    require("@google/genai");

const ai =
    new GoogleGenAI({

        apiKey:
            process.env.GEMINI_API_KEY

    });

async function compressContext(
    question,
    context
) {

    const prompt = `
You are a context compression assistant.

Question:

${question}

Retrieved Context:

${context}

Instructions:

- Remove irrelevant information.
- Keep all facts needed to answer the question.
- Preserve important numbers and policies.
- Do not add any new information.
- Return only the compressed context.
`;

    const response =
        await ai.models.generateContent({

            model:
                "gemini-2.5-flash",

            contents:
                prompt

        });

    return response.text;

}

module.exports =
    compressContext;