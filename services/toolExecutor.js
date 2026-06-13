const tools = require("../tools/toolRegistry");

async function executeTool(toolName, args) {

    const tool = tools[toolName];

    if (!tool) {
        return "Tool not found";
    }

    return await tool(args);
}

module.exports = executeTool;