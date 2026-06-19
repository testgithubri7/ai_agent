const getEmbedding =
    require("../services/embeddingService");

const cosineSimilarity =
    require("../services/cosineSimilarity");

const {
    getVectorStore
} = require("../services/vectorStore");

async function searchDocumentsVectorTool(args)
 {

    const query =
        args.query;

    const source =
        args.source || null;
        
    const queryEmbedding =
        await getEmbedding(query);

    const vectorStore =
        getVectorStore();

    const stopWords = [

        "how",
        "many",
        "what",
        "is",
        "are",
        "the",
        "a",
        "an",
        "do",
        "does",
        "get",
        "can",
        "i",
        "we",
        "you",
        "of",
        "to",
        "in"

    ];

    const keywords =
        query
            .toLowerCase()
            .split(" ")
            .filter(
                word =>
                    !stopWords.includes(word)
            );

    console.log("Keywords:");
    console.log(keywords);

    const results = [];

    for (const item of vectorStore) {

        if (
            source &&
            item.source !== source
        ) {
            continue;
        }

        const score =
            cosineSimilarity(
                queryEmbedding,
                item.embedding
            );

        let keywordScore = 0;

        for (const keyword of keywords) {

            if (
                item.chunk
                    .toLowerCase()
                    .includes(keyword)
            ) {
                keywordScore++;
            }
        }

        const finalScore =
            score +
            (keywordScore * 0.1);

        results.push({

            source:
                item.source,

            chunk:
                item.chunk,

            score,

            keywordScore,

            finalScore

        });

    }

    results.sort(
        (a, b) =>
            b.finalScore - a.finalScore
    );

    console.log(
        "Ranked Results:"
    );

    console.log(results);

    const topResults =
        results
            .filter(
                item =>
                    item.finalScore >= 0.60
            )
            .slice(0, 3);

    console.log(
        "\nTop Sources:"
    );

    console.log(
        topResults.map(
            item => item.source
        )
    );

    return topResults
        .map(
            item =>
                `[Source: ${item.source}]\n${item.chunk}`
        )
        .join("\n\n");
}

module.exports =
    searchDocumentsVectorTool;