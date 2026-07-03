require("dotenv").config();

const multiQueryRetriever =
    require("./services/multiQueryRetriever");

async function test() {

    const results =
        await multiQueryRetriever(
            "How many vacation days do employees get?"
        );

    console.log(
        "\nFINAL RESULTS"
    );

    console.log(results);

}

test();