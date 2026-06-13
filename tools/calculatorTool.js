function calculatorTool(expression) {
  try {
    return eval(expression);
  } catch (error) {
    return "Invalid Expression";
  }
}

module.exports = calculatorTool;