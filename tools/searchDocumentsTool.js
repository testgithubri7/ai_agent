const getEmbedding =
    require("../services/embeddingService");

const cosineSimilarity =
    require("../services/cosineSimilarity");

const {
    getVectorStore
} = require("../services/vectorStore");

async function searchDocumentsVectorTool(query) {

    const queryEmbedding =
        await getEmbedding(query);

    const vectorStore =
        getVectorStore();

    const results = [];

    for (const item of vectorStore) {

        const score =
            cosineSimilarity(
                queryEmbedding,
                item.embedding
            );

        results.push({

            source:
                item.source,

            chunk:
                item.chunk,

            score

        });

    }

    results.sort(
        (a, b) =>
            b.score - a.score
    );

    console.log(
        "Ranked Results:"
    );

    console.log(results);

    const topResults =
        results.slice(0, 3);

    console.log(
        "\nTop Sources:"
    );

    console.log(
        topResults.map(
            item => item.source
        )
    );

    return topResults
        .map(item =>
            `[Source: ${item.source}]\n${item.chunk}`
        )
        .join("\n\n");
}

module.exports =
    searchDocumentsVectorTool;