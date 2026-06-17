require("dotenv").config();

const getEmbedding =
    require("./services/embeddingService");

const cosineSimilarity =
    require("./services/cosineSimilarity");

async function test() {

    const leaveEmbedding =
        await getEmbedding(
            "Employees receive 20 days of paid leave per year."
        );

    const vacationEmbedding =
        await getEmbedding(
            "How many vacation days do employees get?"
        );

    const insuranceEmbedding =
        await getEmbedding(
            "Medical insurance covers employees."
        );

    const score1 =
        cosineSimilarity(
            leaveEmbedding,
            vacationEmbedding
        );

    const score2 =
        cosineSimilarity(
            leaveEmbedding,
            insuranceEmbedding
        );

    console.log(
        "Leave vs Vacation:",
        score1
    );

    console.log(
        "Leave vs Insurance:",
        score2
    );
}

test();