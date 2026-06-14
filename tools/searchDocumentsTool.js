const fs = require("fs");
const path = require("path");

function searchDocumentsTool(query) {

    const filePath = path.join(
        __dirname,
        "../data/company.txt"
    );

    const document =
        fs.readFileSync(
            filePath,
            "utf8"
        );

    const lines =
        document.split("\n");

    const keywords =
        query
            .toLowerCase()
            .split(" ");

    const matches =
        lines.filter(line => {

            const lowerLine =
                line.toLowerCase();

            return keywords.some(
                keyword =>
                    lowerLine.includes(keyword)
            );

        });

    return matches.join("\n");
}

module.exports =
    searchDocumentsTool;