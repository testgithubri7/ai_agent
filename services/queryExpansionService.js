const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function expandQuery(query) {

    const prompt = `
You are a search query expansion assistant.

The user asked:

"${query}"

Generate 3 alternative search queries that mean the same thing.

Rules:
- Keep each query short.
- Preserve the original meaning.
- Return ONLY a JSON array.

Example:

[
  "paid leave policy",
  "vacation days",
  "annual leave"
]
`;

    const response =
        await ai.models.generateContent({

            model: "gemini-2.5-flash",

            contents: prompt

        });

   const text = response.text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

const expandedQueries = JSON.parse(text);

// Always include the original query first
return [
    query,
    ...expandedQueries
];
}

module.exports = expandQuery;