const getEmbedding =
    require("../services/embeddingService");

const searchFaiss =
    require("../services/faissService");

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

    const faissResults =
        await searchFaiss(
            queryEmbedding
        );

    console.log(
        "FAISS Results:"
    );

    console.log(
        faissResults
    );

    const results = [];

    for (
        let i = 0;
        i < faissResults.indices.length;
        i++
    ) {

        const index =
            faissResults.indices[i];

        const item =
            vectorStore[index];

        if (
            source &&
            item.source !== source
        ) {
            continue;
        }

        results.push({

            source:
                item.source,

            chunk:
                item.chunk,

            distance:
                faissResults.distances[i]

        });

    }

    console.log(
        "Retrieved Results:"
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
        .map(
            item =>
                `[Source: ${item.source}]\n${item.chunk}`
        )
        .join("\n\n");
}

module.exports =
    searchDocumentsVectorTool;