const { spawn } = require("child_process");
const path = require("path");

function searchFaiss(queryEmbedding) {

    return new Promise((resolve, reject) => {

        const pythonPath = path.join(
            __dirname,
            "../venv/Scripts/python.exe"
        );

        const scriptPath = path.join(
            __dirname,
            "../faiss_demo/search_faiss.py"
        );

        console.log("Python:", pythonPath);
        console.log("Script:", scriptPath);

        const pythonProcess = spawn(
            pythonPath,
            [scriptPath]
        );

        let result = "";

        pythonProcess.stdout.on(
            "data",
            (data) => {
                result += data.toString();
            }
        );

        pythonProcess.stderr.on(
            "data",
            (data) => {
                console.error(
                    "FAISS Error:",
                    data.toString()
                );
            }
        );

        pythonProcess.on(
            "error",
            (err) => {
                reject(err);
            }
        );

        pythonProcess.on(
            "close",
            (code) => {

                if (code !== 0) {
                    return reject(
                        new Error(
                            `Python process exited with code ${code}`
                        )
                    );
                }

                try {

                    const parsedResult =
                        JSON.parse(result);

                    resolve(parsedResult);

                } catch (err) {

                    reject(err);

                }

            }
        );

        pythonProcess.stdin.write(
            JSON.stringify({
                embedding: queryEmbedding
            })
        );

        pythonProcess.stdin.end();

    });
}

module.exports = searchFaiss;