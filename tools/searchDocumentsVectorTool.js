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
            chunk: item.chunk,
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

    const topChunks =
        results
            .slice(0, 3)
            .map(
                item =>
                    item.chunk
            );

    return topChunks.join(
        "\n\n"
    );
}

module.exports =
    searchDocumentsVectorTool;