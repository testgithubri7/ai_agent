require("dotenv").config();

const compressContext =
    require(
        "./services/contextCompressionService"
    );

async function test() {

    const question =
        "Can unused leave be carried forward?";

    const context = `

Employees receive 25 days of paid leave.

Unused leave can be carried forward for one year.

Office cafeteria opens at 9 AM.

Parking is free for employees.

Leave requests require manager approval.

The company has offices in Hyderabad and Bangalore.

`;

    const compressed =
        await compressContext(

            question,

            context

        );

    console.log(compressed);

}

test();