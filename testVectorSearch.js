require("dotenv").config();

const fs = require("fs");
const path = require("path");

const getEmbedding =
    require("./services/embeddingService");

const cosineSimilarity =
    require("./services/cosineSimilarity");

async function test() {

    const filePath = path.join(
        __dirname,
        "data/company.txt"
    );

    const document =
        fs.readFileSync(
            filePath,
            "utf8"
        );

    const chunks =
        document.split(/\r?\n\r?\n/);

    const query =
        "How many vacation days do employees get?";

    console.log(
        "Generating query embedding..."
    );

    const queryEmbedding =
        await getEmbedding(query);

    const results = [];

    for (const chunk of chunks) {

        const chunkEmbedding =
            await getEmbedding(chunk);

        const score =
            cosineSimilarity(
                queryEmbedding,
                chunkEmbedding
            );

        results.push({
            chunk,
            score
        });

    }

    results.sort(
        (a, b) =>
            b.score - a.score
    );

    console.log(
        "\nRanked Results:\n"
    );

    console.log(results);

}

test();