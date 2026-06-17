const fs = require("fs");
const path = require("path");

const getEmbedding =
    require("./embeddingService");

let vectorStore = [];

async function buildVectorStore() {

    const filePath = path.join(
        __dirname,
        "../data/company.txt"
    );

    const document =
        fs.readFileSync(
            filePath,
            "utf8"
        );

    const chunks =
        document.split(/\r?\n\r?\n/);

    vectorStore = [];

    for (const chunk of chunks) {

        console.log(
            "Embedding:",
            chunk
        );

        const embedding =
            await getEmbedding(chunk);

        vectorStore.push({
            chunk,
            embedding
        });

    }

    console.log(
        "\nVector Store Built"
    );

    console.log(
        "Chunks:",
        vectorStore.length
    );
}

function getVectorStore() {
    return vectorStore;
}

module.exports = {
    buildVectorStore,
    getVectorStore
};