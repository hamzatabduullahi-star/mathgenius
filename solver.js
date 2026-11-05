// ==========================================
// MATHGENIUS - EQUATION SOLVER
// Fixed calculation and display system
// ==========================================


// GET PAGE ELEMENTS

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
const resultContent = document.getElementById("resultContent");

const stepsBox = document.getElementById("stepsBox");
const stepsContent = document.getElementById("stepsContent");


// ==========================================
// FORMAT NUMBERS
// ==========================================

function formatNumber(number) {

    if (!Number.isFinite(number)) {
        return String(number);
    }

    if (Object.is(number, -0)) {
        number = 0;
    }

    return Number(number.toPrecision(12)).toString();
}


// ==========================================
// DISPLAY SOLUTION
// ==========================================

function showSolverMessage(message) {

    if (resultContent) {
        resultContent.textContent = message;
    }

    if (resultBox) {
        resultBox.hidden = false;
    }
}


// ==========================================
// DISPLAY STEP-BY-STEP SOLUTION
// ==========================================

function displaySteps(steps) {

    if (!stepsContent || !stepsBox) return;

    stepsContent.innerHTML = "";

    steps.forEach(function(step, index) {

        const paragraph = document.createElement("p");

        paragraph.style.marginBottom = "14px";
        paragraph.style.padding = "12px";
        paragraph.style.background = "#0b142c";
        paragraph.style.borderRadius = "10px";
        paragraph.style.border = "1px solid rgba(111,130,255,0.15)";

        paragraph.textContent =
            "Step " + (index + 1) + ": " + step;

        stepsContent.appendChild(paragraph);

    });

    stepsBox.hidden = false;
}


// ==========================================
// CLEAR PREVIOUS RESULTS
// ==========================================

function clearSolverResults() {

    if (resultContent) {
        resultContent.textContent = "";
    }

    if (stepsContent) {
        stepsContent.innerHTML = "";
    }

    if (resultBox) {
        resultBox.hidden = true;
    }

    if (stepsBox) {
        stepsBox.hidden = true;
    }

}


// ==========================================
// SAVE EQUATION TO HISTORY
// ==========================================

function saveSolvedEquation(equation, answer) {

    if (typeof saveMathHistory === "function") {

        try {

            saveMathHistory(
                "Equation Solver",
                equation,
                answer
            );

        } catch (error) {

            console.error("History saving failed:", error);

        }

    }

}


// ==========================================
// VALIDATE NUMBERS
// ==========================================

function readNumber(element) {

    if (!element || element.value.trim() === "") {

        throw new Error(
            "Please fill in all required values."
        );

    }

    const value = Number(element.value);

    if (!Number.isFinite(value)) {

        throw new Error(
            "Please enter valid numbers."
        );

    }

    return value;

}


// ==========================================
// UPDATE EQUATION INPUTS
// ==========================================

function updateEquationInputs() {

    if (!equationType) return;

    const selectedType = equationType.value;

    if (linearInputs) {

        linearInputs.hidden = selectedType !== "linear";

    }

    if (quadraticInputs) {

        quadraticInputs.hidden = selectedType !== "quadratic";

    }

    clearSolverResults();

}


// ==========================================
// LINEAR EQUATION
// ax + b = 0
// ==========================================

function solveLinearEquation() {

    const a = readNumber(linearA);
    const b = readNumber(linearB);

    const equation = `${a}x + (${b}) = 0`;

    const steps = [];

    steps.push(
        "Start with the equation: " + equation
    );

    steps.push(
        "Identify the coefficient of x as a = " + a +
        " and the constant as b = " + b + "."
    );


    // INFINITELY MANY SOLUTIONS

    if (a === 0 && b === 0) {

        steps.push(
            "The equation becomes 0x + 0 = 0."
        );

        steps.push(
            "This simplifies to 0 = 0, which is always true."
        );

        showSolverMessage(
            "Infinitely many solutions. Every real number is a solution."
        );

        displaySteps(steps);

        saveSolvedEquation(
            equation,
            "Infinitely many solutions"
        );

        return;

    }


    // NO SOLUTION

    if (a === 0) {

        steps.push(
            "The equation becomes " + b + " = 0."
        );

        steps.push(
            "Since " + b + " is not zero, the equation is impossible."
        );

        showSolverMessage(
            "No solution exists because the coefficient of x is zero."
        );

        displaySteps(steps);

        saveSolvedEquation(
            equation,
            "No solution"
        );

        return;

    }


    // NORMAL LINEAR EQUATION

    const negativeB = -b;

    const x = negativeB / a;

    const answer = formatNumber(x);

    steps.push(
        "Move the constant to the right side: " +
        a + "x = " + negativeB + "."
    );

    steps.push(
        "Divide both sides by " + a + "."
    );

    steps.push(
        "x = " + negativeB + " ÷ " + a + "."
    );

    steps.push(
        "Therefore, x = " + answer + "."
    );


    showSolverMessage(
        "Final Answer: x = " + answer
    );

    displaySteps(steps);

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
            "The value of a cannot be zero in a quadratic equation."
        );

    }


    const equation =
        `${a}x² + (${b})x + (${c}) = 0`;


    // DISCRIMINANT

    const discriminant =
        b * b - 4 * a * c;


    const steps = [];

    steps.push(
        "Start with the equation: " + equation
    );

    steps.push(
        "Identify a = " + a +
        ", b = " + b +
        ", and c = " + c + "."
    );

    steps.push(
        "Use the discriminant formula: D = b² - 4ac."
    );

    steps.push(
        "Substitute the values: D = (" + b +
        ")² - 4(" + a + ")(" + c + ")."
    );

    steps.push(
        "The discriminant is D = " +
        formatNumber(discriminant) + "."
    );


    let answer = "";


    // TWO DISTINCT REAL ROOTS

    if (discriminant > 0) {

        const sqrtD = Math.sqrt(discriminant);

        const x1 = (-b + sqrtD) / (2 * a);

        const x2 = (-b - sqrtD) / (2 * a);

        const root1 = formatNumber(x1);

        const root2 = formatNumber(x2);


        answer =
            "x₁ = " + root1 +
            " and x₂ = " + root2;


        steps.push(
            "Since D is greater than zero, there are two distinct real roots."
        );

        steps.push(
            "Use the quadratic formula: x = (-b ± √D) / 2a."
        );

        steps.push(
            "Substitute the values into the formula."
        );

        steps.push(
            "The first root is x₁ = " + root1 + "."
        );

        steps.push(
            "The second root is x₂ = " + root2 + "."
        );

    }


    // ONE REPEATED REAL ROOT

    else if (discriminant === 0) {

        const x = -b / (2 * a);

        const root = formatNumber(x);


        answer = "x = " + root;


        steps.push(
            "Since D equals zero, the equation has one repeated real root."
        );

        steps.push(
            "Use x = -b / 2a."
        );

        steps.push(
            "Substitute the values: x = " + (-b) +
            " / (" + (2 * a) + ")."
        );

        steps.push(
            "Therefore, x = " + root + "."
        );

    }


    // COMPLEX ROOTS

    else {

        const realPart = -b / (2 * a);

        const imaginaryPart =
            Math.sqrt(-discriminant) / Math.abs(2 * a);


        const real = formatNumber(realPart);

        const imaginary = formatNumber(imaginaryPart);


        const sign1 = realPart === 0 ? "" :
            realPart + " + ";

        const sign2 = realPart === 0 ? "" :
            realPart + " - ";


        if (realPart === 0) {

            answer =
                "x₁ = " + imaginary + "i, " +
                "x₂ = -" + imaginary + "i";

        } else {

            answer =
                "x₁ = " + sign1 + imaginary + "i, " +
                "x₂ = " + sign2 + imaginary + "i";

        }


        steps.push(
            "Since D is negative, there are no real roots."
        );

        steps.push(
            "The equation has two complex conjugate roots."
        );

        steps.push(
            "The real part is " + real + "."
        );

        steps.push(
            "The imaginary part is " + imaginary + "i."
        );

        steps.push(
            "The solutions are " + answer + "."
        );

    }


    showSolverMessage(
        "Final Answer: " + answer
    );

    displaySteps(steps);

    saveSolvedEquation(
        equation,
        answer
    );

}


// ==========================================
// MAIN SOLVE FUNCTION
// ==========================================

function solveEquation() {

    clearSolverResults();

    try {

        if (!equationType) {

            throw new Error(
                "Equation selector could not be found."
            );

        }


        if (equationType.value === "linear") {

            solveLinearEquation();

        }

        else if (equationType.value === "quadratic") {

            solveQuadraticEquation();

        }

        else {

            throw new Error(
                "Please select a valid equation type."
            );

        }


    } catch (error) {

        showSolverMessage(
            "Error: " + error.message
        );

        console.error(
            "MathGenius Solver Error:",
            error
        );

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


// ==========================================
// INITIALIZE SOLVER
// ==========================================

updateEquationInputs();
