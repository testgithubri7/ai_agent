const expandQuery =
    require("./queryExpansionService");

const getEmbedding =
    require("./embeddingService");

const searchFaiss =
    require("./faissService");

async function multiQueryRetriever(query) {

    // Step 1: Expand query
    const expandedQueries =
        await expandQuery(query);

    console.log(
        "Expanded Queries:"
    );

    console.log(
        expandedQueries
    );

    const allResults = [];

    // Step 2: Search FAISS for every query
    for (const q of expandedQueries) {

        console.log(
            "\nSearching:",
            q
        );

        const embedding =
            await getEmbedding(q);

        const faissResults =
            await searchFaiss(
                embedding
            );

        console.log(
            faissResults
        );

        allResults.push(
            ...faissResults.indices
                .map(
                    (index, i) => ({

                        index,

                        distance:
                            faissResults
                                .distances[i]

                    })
                )
        );

    }

    // Step 3: Remove duplicates
    const uniqueResults =
        new Map();

    for (
        const result
        of allResults
    ) {

        if (
            !uniqueResults.has(
                result.index
            )
        ) {

            uniqueResults.set(
                result.index,
                result
            );

        }
        else {

            // Keep the smaller distance
            const existing =
                uniqueResults.get(
                    result.index
                );

            if (
                result.distance <
                existing.distance
            ) {

                uniqueResults.set(
                    result.index,
                    result
                );

            }
            

        }

    }

    const finalResults =
        Array.from(
            uniqueResults.values()
        );

    finalResults.sort(
        (a, b) =>
            a.distance -
            b.distance
    );

    return finalResults;

}

module.exports =
    multiQueryRetriever;