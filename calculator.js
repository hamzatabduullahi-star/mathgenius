// =====================================
// MATHGENIUS SCIENTIFIC CALCULATOR
// =====================================

let currentExpression = "";
let lastAnswer = "";
let calculationHistory = [];


// Get page elements
const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
const historyContainer = document.getElementById("historyList");
const clearHistoryButton = document.getElementById("clearHistory");


// Update calculator display
function updateDisplay() {
    if (expressionDisplay) {
        expressionDisplay.textContent =
            currentExpression || "0";
    }

    if (resultDisplay) {
        resultDisplay.textContent =
            lastAnswer || "0";
    }
}


// Add a value to the expression
function appendValue(value) {
    currentExpression += value;
    updateDisplay();
}


// Clear calculator
function clearCalculator() {
    currentExpression = "";
    lastAnswer = "";
    updateDisplay();
}


// Delete the last character
function deleteLast() {
    currentExpression = currentExpression.slice(0, -1);
    updateDisplay();
}


// Format calculation results
function formatResult(value) {
    if (typeof value === "number") {
        if (!Number.isFinite(value)) {
            throw new Error("Invalid mathematical result.");
        }

        return Number(value.toPrecision(12)).toString();
    }

    return String(value);
}


// Save successful calculation to local history
function addToHistory(expression, answer) {
    const entry = {
        expression: expression,
        result: answer,
        date: new Date().toLocaleString()
    };

    calculationHistory.unshift(entry);

    // Keep only the latest 20 calculations
    calculationHistory = calculationHistory.slice(0, 20);

    renderHistory();
}


// Render calculator history
function renderHistory() {
    if (!historyContainer) return;

    historyContainer.innerHTML = "";

    if (calculationHistory.length === 0) {
        historyContainer.innerHTML =
            "<p>No calculations yet.</p>";
        return;
    }

    calculationHistory.forEach(function(item) {
        const historyItem = document.createElement("div");

        historyItem.className = "history-item";

        const expression = document.createElement("p");
        expression.textContent = item.expression;

        const answer = document.createElement("strong");
        answer.textContent = "= " + item.result;

        const date = document.createElement("small");
        date.textContent = item.date;

        historyItem.appendChild(expression);
        historyItem.appendChild(answer);
        historyItem.appendChild(date);

        historyItem.addEventListener("click", function() {
            currentExpression = item.expression;
            lastAnswer = item.result;
            updateDisplay();
        });

        historyContainer.appendChild(historyItem);
    });
}


// Clear calculator's visible history
function clearCalculatorHistory() {
    calculationHistory = [];
    renderHistory();
}


// Calculate expression
function calculate() {
    if (!currentExpression.trim()) {
        return;
    }

    if (typeof math === "undefined") {
        alert("Math.js could not load. Please refresh the page.");
        return;
    }

    const expressionToSave = currentExpression;

    try {
        const result = math.evaluate(expressionToSave);

        const formattedResult = formatResult(result);

        lastAnswer = formattedResult;

        // Add to calculator's recent history
        addToHistory(expressionToSave, formattedResult);

        // Save to the user's MathGenius account history
        if (typeof saveMathHistory === "function") {
            saveMathHistory(
                "Scientific Calculator",
                expressionToSave,
                formattedResult
            );
        }

        currentExpression = formattedResult;

        updateDisplay();

    } catch (error) {
        lastAnswer = "Error";

        if (resultDisplay) {
            resultDisplay.textContent = "Invalid expression";
        }

        console.error("Calculation error:", error);
    }
}


// Handle calculator buttons
document.querySelectorAll(".calc-btn").forEach(function(button) {
    button.addEventListener("click", function() {
        const action = button.dataset.action;
        const value = button.dataset.value;

        if (action === "clear") {
            clearCalculator();
        }

        else if (action === "delete") {
            deleteLast();
        }

        else if (action === "calculate") {
            calculate();
        }

        else if (value !== undefined) {
            appendValue(value);
        }
    });
});


// Keyboard support
document.addEventListener("keydown", function(event) {
    const key = event.key;

    if (
        /^[0-9+\-*/().%^]$/.test(key)
    ) {
        appendValue(key);
    }

    else if (key === "Enter") {
        event.preventDefault();
        calculate();
    }

    else if (key === "Backspace") {
        deleteLast();
    }

    else if (key === "Escape") {
        clearCalculator();
    }
});


// Clear calculator history button
if (clearHistoryButton) {
    clearHistoryButton.addEventListener(
        "click",
        clearCalculatorHistory
    );
}


// Initialize calculator
updateDisplay();
renderHistory();
