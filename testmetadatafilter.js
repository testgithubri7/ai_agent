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
            "policy",
            "handbook.txt"
        );

    console.log(result);
}

test();