// ==========================================
// MATHGENIUS SCIENTIFIC CALCULATOR
// ==========================================

// DISPLAY ELEMENTS

const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
const historyList = document.getElementById("historyList");


// CALCULATOR VARIABLES

let currentExpression = "";
let lastAnswer = 0;

let calculationHistory = [];


// ==========================================
// UPDATE DISPLAY
// ==========================================

function updateDisplay() {

    expressionDisplay.textContent =
        currentExpression || "Ready for calculation";

}


// ==========================================
// ADD VALUE TO CALCULATOR
// ==========================================

function addValue(value) {

    if (value === "Ans") {

        currentExpression += String(lastAnswer);

    } else {

        currentExpression += value;

    }

    updateDisplay();

}


// ==========================================
// CLEAR CALCULATOR
// ==========================================

function clearCalculator() {

    currentExpression = "";

    expressionDisplay.textContent = "Ready for calculation";

    resultDisplay.textContent = "0";

}


// ==========================================
// DELETE LAST CHARACTER
// ==========================================

function deleteCharacter() {

    currentExpression = currentExpression.slice(0, -1);

    updateDisplay();

}


// ==========================================
// PERFORM CALCULATION
// ==========================================

function calculate() {

    if (!currentExpression.trim()) {
        return;
    }

    if (typeof math === "undefined") {

        resultDisplay.textContent = "Error";

        expressionDisplay.textContent =
            "Calculation library unavailable.";

        return;

    }

    try {

        const result = math.evaluate(currentExpression);

        if (
            typeof result !== "number" ||
            !Number.isFinite(result)
        ) {

            throw new Error("Invalid calculation");

        }

        const formattedResult = Number(
            result.toPrecision(12)
        );

        // DISPLAY ANSWER

        resultDisplay.textContent = formattedResult;

        // SAVE ANSWER

        lastAnswer = formattedResult;

        // ADD TO HISTORY

        addToHistory(
            currentExpression,
            formattedResult
        );

        // KEEP ANSWER FOR NEXT CALCULATION

        currentExpression = String(formattedResult);

        expressionDisplay.textContent =
            "Calculation successful";

    } catch (error) {

        resultDisplay.textContent = "Error";

        expressionDisplay.textContent =
            "Please check your mathematical expression.";

    }

}


// ==========================================
// ADD CALCULATION TO HISTORY
// ==========================================

function addToHistory(expression, result) {

    calculationHistory.unshift({

        expression: expression,

        result: result

    });

    // KEEP ONLY THE LATEST 20 CALCULATIONS

    calculationHistory =
        calculationHistory.slice(0, 20);

    renderHistory();

}


// ==========================================
// DISPLAY CALCULATION HISTORY
// ==========================================

function renderHistory() {

    historyList.innerHTML = "";

    if (calculationHistory.length === 0) {

        historyList.innerHTML = `
            <p class="empty-history">
                Your calculations will appear here.
            </p>
        `;

        return;

    }

    calculationHistory.forEach(function(item) {

        const historyItem = document.createElement("div");

        historyItem.className = "history-item";

        const expression = document.createElement("p");

        expression.textContent = item.expression;

        const answer = document.createElement("strong");

        answer.textContent = "= " + item.result;

        historyItem.appendChild(expression);

        historyItem.appendChild(answer);

        // CLICK HISTORY TO REUSE ANSWER

        historyItem.addEventListener("click", function() {

            currentExpression = String(item.result);

            resultDisplay.textContent = item.result;

            expressionDisplay.textContent =
                "Previous result selected";

        });

        historyList.appendChild(historyItem);

    });

}


// ==========================================
// CALCULATOR BUTTON EVENTS
// ==========================================

document.querySelectorAll(".calc-btn").forEach(function(button) {

    button.addEventListener("click", function() {

        const action = this.dataset.action;

        const value = this.dataset.value;


        if (action === "clear") {

            clearCalculator();

        }

        else if (action === "delete") {

            deleteCharacter();

        }

        else if (action === "calculate") {

            calculate();

        }

        else if (value !== undefined) {

            addValue(value);

        }

    });

});


// ==========================================
// CLEAR HISTORY
// ==========================================

document.getElementById("clearHistory")
    .addEventListener("click", function() {

        calculationHistory = [];

        renderHistory();

    });


// ==========================================
// KEYBOARD SUPPORT
// ==========================================

document.addEventListener("keydown", function(event) {

    const key = event.key;


    // NUMBERS AND DECIMALS

    if (/^[0-9.]$/.test(key)) {

        addValue(key);

    }

    // MATHEMATICAL OPERATORS

    else if (
        ["+", "-", "*", "/", "^", "%", "(", ")", "!"].includes(key)
    ) {

        addValue(key);

    }

    // CALCULATE

    else if (key === "Enter" || key === "=") {

        event.preventDefault();

        calculate();

    }

    // DELETE

    else if (key === "Backspace") {

        deleteCharacter();

    }

    // CLEAR

    else if (key === "Escape") {

        clearCalculator();

    }

});


// ==========================================
// INITIALIZE CALCULATOR
// ==========================================

renderHistory();

updateDisplay();
