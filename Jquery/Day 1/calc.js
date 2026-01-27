const display = document.getElementById("display");
 
let firstValue = "";
let secondValue = "";
let operator = "";
let isPercent = false;
let isSecondValue = false;
 
function updateDisplay() {
    if (!operator) {
        display.innerText = firstValue || "0";
    } else if (isSecondValue && secondValue === "") {
        display.innerText = firstValue + " " + operator;
    } else {
        display.innerText = firstValue + " " + operator + " " + secondValue;
    }
}
 
// Number button
function pressNumber(num) {
    if (!isSecondValue) {
        firstValue += num;
        display.innerText = firstValue;
    } else {
        secondValue += num;
        display.innerText = secondValue;
    }
     updateDisplay();
}
 
// Decimal
function pressDecimal() {
    if (!isSecondValue) {
        if (!firstValue.includes(".")) firstValue += ".";
        display.innerText = firstValue;
    } else {
        if (!secondValue.includes(".")) secondValue += ".";
        display.innerText = secondValue;
    }
    updateDisplay();
}
 
// Operator
function pressOperator(op) {
    if (firstValue === "" && op === "-") {
        firstValue = "-";
        updateDisplay();
        return;
    }
 
    // Prevent operator if only "-" is present
    if (firstValue === "-" ) return;
 
    // Percentage logic (unchanged)
    if (op === "%" && firstValue !== "" && !isSecondValue) {
        firstValue = (parseFloat(firstValue) / 100).toString();
        operator = "x";
        isSecondValue = true;
        secondValue = "";
        updateDisplay();
        return;
    }
 
    // Prevent operator without number
    if (firstValue === "") return;
 
    operator = op;
    isSecondValue = true;
    updateDisplay();
}
 
 
// AC
function pressAC() {
    firstValue = "";
    secondValue = "";
    operator = "";
    isPercent = false;
    isSecondValue = false;
    display.innerText = "0";
}
 
// Equal
function pressEqual() {
    if (!firstValue || !operator) return;
    if (!secondValue) secondValue = "0";
 
    let a = parseFloat(firstValue);
    let b = parseFloat(secondValue);
 
    let result;
 
    switch(operator) {
        case "+":
            if (isPercent) {
                b = (a * b) / 100; // convert second number to % of first
            }
            result = a + b;
            break;
        case "-":
            if (isPercent) {
                b = (a * b) / 100;
            }
            result = a - b;
            break;
        case "x":
            result = a * b;
            break;
        case "÷":
            result = a / b;
            break;
        case "%":
            result = (a * b) / 100; // a% of b
            break;
        default:
            result = b;
            break;
    }
 
    display.innerText = result.toString();
 
    // Reset for next calculation
    firstValue = result.toString();
    secondValue = "";
    operator = "";
    isPercent = false;
    isSecondValue = false;
}