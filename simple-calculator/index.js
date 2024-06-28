const calculator = {
  displayValue: "0",
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
  expression: "",
};

function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    calculator.displayValue =
      displayValue === "0" ? digit : displayValue + digit;
  }

  calculator.expression += digit;
  updateDisplay();
}

function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand === true) return;

  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
    calculator.expression += dot;
  }
  updateDisplay();
}

function handleOperator(nextOperator) {
  const { displayValue, operator } = calculator;
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator;
    calculator.expression = calculator.expression.slice(0, -1) + nextOperator;
    updateDisplay();
    return;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
  calculator.expression += ` ${nextOperator} `;
  updateDisplay();
}

function resetCalculator() {
  calculator.displayValue = "0";
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
  calculator.expression = "";
  updateDisplay();
}

function deleteLastDigit() {
  calculator.displayValue = calculator.displayValue.slice(0, -1) || "0";
  calculator.expression = calculator.expression.slice(0, -1) || "";
  updateDisplay();
}

function handleEqualSign() {
  const expression = calculator.expression.trim();
  const postfixExpression = infixToPostfix(expression);
  const result = evaluatePostfix(postfixExpression);

  calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
  calculator.expression = `${parseFloat(result.toFixed(7))}`;
  calculator.firstOperand = null;
  calculator.operator = null;
  calculator.waitingForSecondOperand = false;
  updateDisplay();
}

function updateDisplay() {
  const display = document.querySelector(".calculator-screen");
  display.value = calculator.expression || calculator.displayValue;
}

function infixToPostfix(expression) {
  const output = [];
  const operators = [];
  const tokens = expression.split(" ");

  const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
  };

  tokens.forEach((token) => {
    if (isNumeric(token)) {
      output.push(token);
    } else if (token in precedence) {
      while (
        operators.length &&
        precedence[operators[operators.length - 1]] >= precedence[token]
      ) {
        output.push(operators.pop());
      }
      operators.push(token);
    }
  });

  while (operators.length) {
    output.push(operators.pop());
  }

  return output;
}

function evaluatePostfix(postfixExpression) {
  const stack = [];

  postfixExpression.forEach((token) => {
    if (isNumeric(token)) {
      stack.push(parseFloat(token));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      switch (token) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          stack.push(a / b);
          break;
      }
    }
  });

  return stack[0];
}

function isNumeric(str) {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}

updateDisplay();

const keys = document.querySelector(".calculator-keys");
keys.addEventListener("click", (event) => {
  const { target } = event;
  if (!target.matches("button")) {
    return;
  }

  if (target.classList.contains("operator")) {
    handleOperator(target.value);
    return;
  }

  if (target.classList.contains("decimal")) {
    inputDecimal(target.value);
    return;
  }

  if (target.classList.contains("all-clear")) {
    resetCalculator();
    return;
  }

  if (target.classList.contains("backspace")) {
    deleteLastDigit();
    return;
  }

  if (target.classList.contains("equal-sign")) {
    handleEqualSign();
    return;
  }

  inputDigit(target.value);
});
