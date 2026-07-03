const multiQueryRetriever =
    require("../services/multiQueryRetriever");

const {
    getVectorStore
} = require("../services/vectorStore");

async function searchDocumentsVectorTool(args)
{
    const query =
        args.query;

    const source =
        args.source || null;

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

    // -------------------------------
    // Multi Query Retrieval
    // -------------------------------

    const retrievalResults =
        await multiQueryRetriever(
            query
        );

    console.log(
        "Multi Query Results:"
    );

    console.log(
        retrievalResults
    );

    const results = [];

    for (
        const result
        of retrievalResults
    ) {

        const item =
            vectorStore[
                result.index
            ];

        if (
            source &&
            item.source !== source
        ) {
            continue;
        }

        const distance =
            result.distance;

        // Convert FAISS distance into similarity score
        const semanticScore =
            1 / (1 + distance);

        let keywordScore = 0;

        for (
            const keyword
            of keywords
        ) {

            if (
                item.chunk
                    .toLowerCase()
                    .includes(keyword)
            ) {

                keywordScore++;

            }

        }

        const finalScore =
            semanticScore +
            (keywordScore * 0.2);

        results.push({

            source:
                item.source,

            chunk:
                item.chunk,

            distance,

            semanticScore,

            keywordScore,

            finalScore

        });

    }

    results.sort(

        (a, b) =>

            b.finalScore -
            a.finalScore

    );

    console.log(
        "\nHybrid Ranked Results:"
    );

    console.log(
        results
    );

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

        .map(

            item =>

                `[Source: ${item.source}]\n${item.chunk}`

        )

        .join("\n\n");

}

module.exports =
    searchDocumentsVectorTool;