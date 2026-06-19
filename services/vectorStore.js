const fs = require("fs");
const path = require("path");

const getEmbedding =
    require("./embeddingService");

const generateHash =
    require("./hashService");

let vectorStore = [];

async function buildVectorStore() {

    const dataFolder = path.join(
        __dirname,
        "../data"
    );

    const vectorStorePath = path.join(
        __dirname,
        "../data/vectorStore.json"
    );

    const textFiles =
        fs.readdirSync(dataFolder)
            .filter(
                file =>
                    file.endsWith(".txt")
            );

    console.log(
        "Documents Found:"
    );

    console.log(textFiles);

    let combinedContent = "";

    for (const file of textFiles) {

        const filePath = path.join(
            dataFolder,
            file
        );

        combinedContent +=
            fs.readFileSync(
                filePath,
                "utf8"
            );

    }

    const currentHash =
        generateHash(
            combinedContent
        );

    if (
        fs.existsSync(
            vectorStorePath
        )
    ) {

        const storedData =
            JSON.parse(
                fs.readFileSync(
                    vectorStorePath,
                    "utf8"
                )
            );

        if (
            storedData.hash ===
            currentHash
        ) {

            console.log(
                "Documents unchanged."
            );

            console.log(
                "Loading existing vector store..."
            );

            vectorStore =
                storedData.vectors;

            console.log(
                "Vector Store Loaded"
            );

            console.log(
                "Chunks:",
                vectorStore.length
            );

            return;
        }

        console.log(
            "Documents changed."
        );

        console.log(
            "Rebuilding vector store..."
        );

    }

    vectorStore = [];

    for (const file of textFiles) {

        const filePath = path.join(
            dataFolder,
            file
        );

        const document =
            fs.readFileSync(
                filePath,
                "utf8"
            );

        const chunks =
            document.split(
                /\r?\n\r?\n/
            );

        for (const chunk of chunks) {

            console.log(
                "Embedding:",
                file,
                "=>",
                chunk
            );

            const embedding =
                await getEmbedding(
                    chunk
                );

            vectorStore.push({

                source: file,

                chunk,

                embedding

            });

        }

    }

    const dataToStore = {

        hash:
            currentHash,

        vectors:
            vectorStore

    };

    fs.writeFileSync(
        vectorStorePath,
        JSON.stringify(
            dataToStore,
            null,
            2
        )
    );

    console.log(
        "\nVector Store Saved"
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