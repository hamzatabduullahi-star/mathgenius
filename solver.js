// ==========================================
// MATHGENIUS - EQUATION SOLVER
// ==========================================


// Get page elements
const equationType = document.getElementById("equationType");
const linearInputs = document.getElementById("linearInputs");
const quadraticInputs = document.getElementById("quadraticInputs");

const linearA = document.getElementById("linearA");
const linearB = document.getElementById("linearB");

const quadraticA = document.getElementById("quadraticA");
const quadraticB = document.getElementById("quadraticB");
const quadraticC = document.getElementById("quadraticC");

const solveButton = document.getElementById("solveButton");
const resultBox = document.getElementById("resultBox");
const stepsBox = document.getElementById("stepsBox");


// Display messages safely
function showSolverMessage(message) {
    if (resultBox) {
        resultBox.textContent = message;
    }
}


// Save solved equation to MathGenius history
function saveSolvedEquation(equation, answer) {
    if (typeof saveMathHistory === "function") {
        saveMathHistory(
            "Equation Solver",
            equation,
            answer
        );
    }
}


// Change equation type
function updateEquationInputs() {
    if (!equationType) return;

    const selectedType = equationType.value;

    if (linearInputs) {
        linearInputs.style.display =
            selectedType === "linear" ? "block" : "none";
    }

    if (quadraticInputs) {
        quadraticInputs.style.display =
            selectedType === "quadratic" ? "block" : "none";
    }

    if (resultBox) resultBox.textContent = "";

    if (stepsBox) stepsBox.innerHTML = "";
}


// Validate numerical input
function readNumber(element) {
    if (!element || element.value.trim() === "") {
        throw new Error("Please fill in all required values.");
    }

    const value = Number(element.value);

    if (!Number.isFinite(value)) {
        throw new Error("Please enter valid numbers.");
    }

    return value;
}


// Display solution steps
function displaySteps(steps) {
    if (!stepsBox) return;

    stepsBox.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = "Step-by-Step Solution";

    stepsBox.appendChild(heading);

    steps.forEach(function(step, index) {
        const paragraph = document.createElement("p");

        paragraph.textContent =
            "Step " + (index + 1) + ": " + step;

        stepsBox.appendChild(paragraph);
    });
}


// ==========================================
// LINEAR EQUATION
// ax + b = 0
// ==========================================

function solveLinearEquation() {
    const a = readNumber(linearA);
    const b = readNumber(linearB);

    const equation = `${a}x + (${b}) = 0`;

    if (a === 0 && b === 0) {
        showSolverMessage(
            "Every real number is a solution."
        );

        displaySteps([
            "The equation is 0x + 0 = 0.",
            "This simplifies to 0 = 0.",
            "The statement is always true."
        ]);

        saveSolvedEquation(
            equation,
            "Infinitely many solutions"
        );

        return;
    }

    if (a === 0) {
        showSolverMessage(
            "No solution exists."
        );

        displaySteps([
            "The equation is 0x + " + b + " = 0.",
            "This becomes " + b + " = 0.",
            "Since " + b + " is not zero, there is no solution."
        ]);

        saveSolvedEquation(
            equation,
            "No solution"
        );

        return;
    }

    const x = -b / a;

    const answer = Number(x.toPrecision(12));

    showSolverMessage("x = " + answer);

    displaySteps([
        "Start with " + equation + ".",
        "Move the constant to the right: " + a + "x = " + (-b) + ".",
        "Divide both sides by " + a + ".",
        "Therefore, x = " + answer + "."
    ]);

    saveSolvedEquation(
        equation,
        "x = " + answer
    );
}


// ==========================================
// QUADRATIC EQUATION
// ax² + bx + c = 0
// ==========================================

function solveQuadraticEquation() {
    const a = readNumber(quadraticA);
    const b = readNumber(quadraticB);
    const c = readNumber(quadraticC);

    if (a === 0) {
        throw new Error(
            "The coefficient of x² cannot be zero for a quadratic equation."
        );
    }

    const equation =
        `${a}x² + (${b})x + (${c}) = 0`;

    const discriminant = b * b - 4 * a * c;

    const steps = [
        "Start with " + equation + ".",
        "Identify a = " + a + ", b = " + b + ", c = " + c + ".",
        "Calculate the discriminant: D = b² - 4ac.",
        "D = " + discriminant + "."
    ];

    let answer;

    if (discriminant > 0) {
        const x1 =
            (-b + Math.sqrt(discriminant)) / (2 * a);

        const x2 =
            (-b - Math.sqrt(discriminant)) / (2 * a);

        const root1 = Number(x1.toPrecision(12));
        const root2 = Number(x2.toPrecision(12));

        answer = `x₁ = ${root1}, x₂ = ${root2}`;

        steps.push(
            "Since D > 0, there are two distinct real roots."
        );

        steps.push(
            "Apply the quadratic formula."
        );

        steps.push(
            "The solutions are x₁ = " + root1 +
            " and x₂ = " + root2 + "."
        );
    }

    else if (discriminant === 0) {
        const x = -b / (2 * a);

        const root = Number(x.toPrecision(12));

        answer = `x = ${root}`;

        steps.push(
            "Since D = 0, there is one repeated real root."
        );

        steps.push(
            "Apply x = -b / 2a."
        );

        steps.push(
            "The solution is x = " + root + "."
        );
    }

    else {
        const realPart = -b / (2 * a);

        const imaginaryPart =
            Math.sqrt(-discriminant) / Math.abs(2 * a);

        const real = Number(realPart.toPrecision(12));
        const imaginary = Number(imaginaryPart.toPrecision(12));

        answer =
            `x₁ = ${real} + ${imaginary}i, ` +
            `x₂ = ${real} - ${imaginary}i`;

        steps.push(
            "Since D < 0, there are two complex roots."
        );

        steps.push(
            "Apply the quadratic formula using the imaginary unit i."
        );

        steps.push(
            "The solutions are " + answer + "."
        );
    }

    showSolverMessage(answer);

    displaySteps(steps);

    saveSolvedEquation(equation, answer);
}


// ==========================================
// SOLVE BUTTON
// ==========================================

function solveEquation() {
    try {
        if (resultBox) resultBox.textContent = "";

        if (stepsBox) stepsBox.innerHTML = "";

        if (!equationType) {
            throw new Error("Equation selector was not found.");
        }

        if (equationType.value === "linear") {
            solveLinearEquation();
        }

        else if (equationType.value === "quadratic") {
            solveQuadraticEquation();
        }

        else {
            throw new Error("Please select an equation type.");
        }

    } catch (error) {
        showSolverMessage(error.message);

        if (stepsBox) {
            stepsBox.innerHTML = "";
        }
    }
}


// ==========================================
// EVENT LISTENERS
// ==========================================

if (equationType) {
    equationType.addEventListener(
        "change",
        updateEquationInputs
    );
}

if (solveButton) {
    solveButton.addEventListener(
        "click",
        solveEquation
    );
}


// Initialize solver
updateEquationInputs();
