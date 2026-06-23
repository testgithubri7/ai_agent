require("dotenv").config();

const fs = require("fs");

const searchFaiss =
    require("./services/faissService");

async function test() {

    const data = JSON.parse(
        fs.readFileSync(
            "./data/vectorStore.json",
            "utf8"
        )
    );

    const embedding =
        data.vectors[0].embedding;

    const result =
        await searchFaiss(
            embedding
        );

    console.log("\nFAISS RESULT:");
    console.log(result);
}

test();