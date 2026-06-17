require("dotenv").config();

const getEmbedding =
    require("./services/embeddingService");

async function test() {

    const embedding =
        await getEmbedding(
            "Employees receive 20 days of paid leave per year."
        );

    console.log(
        "Vector Length:",
        embedding.length
    );

    console.log(
        embedding.slice(0, 10)
    );
}

test();