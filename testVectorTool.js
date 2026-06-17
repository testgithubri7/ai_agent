require("dotenv").config();

const {
    buildVectorStore
} = require("./services/vectorStore");

const searchDocumentsVectorTool =
    require("./tools/searchDocumentsVectorTool");

async function test() {

    await buildVectorStore();

    const result =
        await searchDocumentsVectorTool(
            "What is the leave policy?"
        );

    console.log(
        "\nRetrieved:\n"
    );

    console.log(result);
}

test();