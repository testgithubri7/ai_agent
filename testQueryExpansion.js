require("dotenv").config();

const expandQuery =
    require("./services/queryExpansionService");

async function test() {

    const queries =
        await expandQuery(
            "How many vacation days do employees get?"
        );

    console.log(queries);

}

test();