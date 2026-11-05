// ==========================================
// MATHGENIUS - MATRIX CALCULATOR
// ==========================================


// Page elements
const rowsA = document.getElementById("rowsA");
const colsA = document.getElementById("colsA");
const rowsB = document.getElementById("rowsB");
const colsB = document.getElementById("colsB");

const matrixAGrid = document.getElementById("matrixAGrid");
const matrixBGrid = document.getElementById("matrixBGrid");

const matrixError = document.getElementById("matrixError");
const matrixResult = document.getElementById("matrixResult");


// ==========================================
// MATRIX INPUT GRIDS
// ==========================================

function createMatrixGrid(container, rows, cols, name) {
    if (!container) return;

    container.innerHTML = "";

    container.style.display = "grid";
    container.style.gridTemplateColumns =
        `repeat(${cols}, minmax(0, 1fr))`;

    container.style.gap = "8px";

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement("input");

            input.type = "number";
            input.step = "any";
            input.placeholder = `${name}${i + 1}${j + 1}`;
            input.dataset.row = i;
            input.dataset.col = j;

            input.style.width = "100%";
            input.style.minWidth = "0";
            input.style.padding = "10px";
            input.style.borderRadius = "7px";

            container.appendChild(input);
        }
    }
}


function updateMatrixGrids() {
    createMatrixGrid(
        matrixAGrid,
        Number(rowsA.value),
        Number(colsA.value),
        "A"
    );

    createMatrixGrid(
        matrixBGrid,
        Number(rowsB.value),
        Number(colsB.value),
        "B"
    );

    clearMatrixOutput();
}


// ==========================================
// READ MATRIX VALUES
// ==========================================

function readMatrix(container, rows, cols) {
    const matrix = [];

    if (!container) {
        throw new Error("Matrix input area was not found.");
    }

    const inputs = container.querySelectorAll("input");

    for (let i = 0; i < rows; i++) {
        const row = [];

        for (let j = 0; j < cols; j++) {
            const input = inputs[i * cols + j];

            if (!input || input.value.trim() === "") {
                throw new Error(
                    "Please fill in every matrix cell."
                );
            }

            const value = Number(input.value);

            if (!Number.isFinite(value)) {
                throw new Error(
                    "Please enter valid numbers in the matrix."
                );
            }

            row.push(value);
        }

        matrix.push(row);
    }

    return matrix;
}


// ==========================================
// MATRIX UTILITIES
// ==========================================

function formatMatrixNumber(number) {
    if (Math.abs(number) < 1e-12) {
        return "0";
    }

    return Number(number.toPrecision(10)).toString();
}


function formatMatrix(matrix) {
    return matrix
        .map(row => `[${row.map(formatMatrixNumber).join(", ")}]`)
        .join("\n");
}


function displayMatrixResult(title, matrix) {
    if (!matrixResult) return;

    matrixResult.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = title;

    const output = document.createElement("pre");
    output.textContent = Array.isArray(matrix)
        ? formatMatrix(matrix)
        : String(matrix);

    output.style.whiteSpace = "pre-wrap";
    output.style.overflowWrap = "anywhere";

    matrixResult.appendChild(heading);
    matrixResult.appendChild(output);
}


function showMatrixError(message) {
    if (matrixError) {
        matrixError.textContent = message;
        matrixError.style.display = "block";
    }
}


function clearMatrixOutput() {
    if (matrixError) {
        matrixError.textContent = "";
        matrixError.style.display = "none";
    }

    if (matrixResult) {
        matrixResult.innerHTML = "";
    }
}


// ==========================================
// SAVE TO MATHGENIUS HISTORY
// ==========================================

function saveMatrixHistory(operation, matrixA, result) {
    if (typeof saveMathHistory === "function") {
        saveMathHistory(
            "Matrix Calculator - " + operation,
            "Matrix A: " + formatMatrix(matrixA),
            formatMatrix(result)
        );
    }
}


// ==========================================
// MATRIX ADDITION
// ==========================================

function addMatrices() {
    clearMatrixOutput();

    try {
        const rA = Number(rowsA.value);
        const cA = Number(colsA.value);
        const rB = Number(rowsB.value);
        const cB = Number(colsB.value);

        if (rA !== rB || cA !== cB) {
            throw new Error(
                "Addition requires matrices of the same dimensions."
            );
        }

        const A = readMatrix(matrixAGrid, rA, cA);
        const B = readMatrix(matrixBGrid, rB, cB);

        const result = A.map((row, i) =>
            row.map((value, j) => value + B[i][j])
        );

        displayMatrixResult("Matrix Addition Result", result);

        saveMatrixHistory("Addition", A, result);

    } catch (error) {
        showMatrixError(error.message);
    }
}


// ==========================================
// MATRIX SUBTRACTION
// ==========================================

function subtractMatrices() {
    clearMatrixOutput();

    try {
        const rA = Number(rowsA.value);
        const cA = Number(colsA.value);
        const rB = Number(rowsB.value);
        const cB = Number(colsB.value);

        if (rA !== rB || cA !== cB) {
            throw new Error(
                "Subtraction requires matrices of the same dimensions."
            );
        }

        const A = readMatrix(matrixAGrid, rA, cA);
        const B = readMatrix(matrixBGrid, rB, cB);

        const result = A.map((row, i) =>
            row.map((value, j) => value - B[i][j])
        );

        displayMatrixResult("Matrix Subtraction Result", result);

        saveMatrixHistory("Subtraction", A, result);

    } catch (error) {
        showMatrixError(error.message);
    }
}


// ==========================================
// MATRIX MULTIPLICATION
// ==========================================

function multiplyMatrices() {
    clearMatrixOutput();

    try {
        const rA = Number(rowsA.value);
        const cA = Number(colsA.value);
        const rB = Number(rowsB.value);
        const cB = Number(colsB.value);

        if (cA !== rB) {
            throw new Error(
                "The columns of Matrix A must equal the rows of Matrix B."
            );
        }

        const A = readMatrix(matrixAGrid, rA, cA);
        const B = readMatrix(matrixBGrid, rB, cB);

        const result = [];

        for (let i = 0; i < rA; i++) {
            const row = [];

            for (let j = 0; j < cB; j++) {
                let sum = 0;

                for (let k = 0; k < cA; k++) {
                    sum += A[i][k] * B[k][j];
                }

                row.push(sum);
            }

            result.push(row);
        }

        displayMatrixResult("Matrix Multiplication Result", result);

        saveMatrixHistory("Multiplication", A, result);

    } catch (error) {
        showMatrixError(error.message);
    }
}


// ==========================================
// MATRIX TRANSPOSE
// ==========================================

function transposeMatrix(matrix) {
    return matrix[0].map((_, columnIndex) =>
        matrix.map(row => row[columnIndex])
    );
}


function transposeA() {
    clearMatrixOutput();

    try {
        const A = readMatrix(
            matrixAGrid,
            Number(rowsA.value),
            Number(colsA.value)
        );

        const result = transposeMatrix(A);

        displayMatrixResult("Transpose of Matrix A", result);

        saveMatrixHistory("Transpose A", A, result);

    } catch (error) {
        showMatrixError(error.message);
    }
}


function transposeB() {
    clearMatrixOutput();

    try {
        const B = readMatrix(
            matrixBGrid,
            Number(rowsB.value),
            Number(colsB.value)
        );

        const result = transposeMatrix(B);

        displayMatrixResult("Transpose of Matrix B", result);

        saveMatrixHistory("Transpose B", B, result);

    } catch (error) {
        showMatrixError(error.message);
    }
}


// ==========================================
// DETERMINANT
// ==========================================

function determinant(matrix) {
    const n = matrix.length;

    if (n === 1) {
        return matrix[0][0];
    }

    if (n === 2) {
        return (
            matrix[0][0] * matrix[1][1] -
            matrix[0][1] * matrix[1][0]
        );
    }

    let result = 0;

    for (let column = 0; column < n; column++) {
        const minor = matrix.slice(1).map(row =>
            row.filter((_, index) => index !== column)
        );

        result +=
            Math.pow(-1, column) *
            matrix[0][column] *
            determinant(minor);
    }

    return result;
}


function calculateDeterminantA() {
    clearMatrixOutput();

    try {
        const rows = Number(rowsA.value);
        const cols = Number(colsA.value);

        if (rows !== cols) {
            throw new Error(
                "Determinant requires a square matrix."
            );
        }

        const A = readMatrix(matrixAGrid, rows, cols);
        const result = determinant(A);

        displayMatrixResult(
            "Determinant of Matrix A",
            formatMatrixNumber(result)
        );

        if (typeof saveMathHistory === "function") {
            saveMathHistory(
                "Matrix Determinant A",
                formatMatrix(A),
                formatMatrixNumber(result)
            );
        }

    } catch (error) {
        showMatrixError(error.message);
    }
}


function calculateDeterminantB() {
    clearMatrixOutput();

    try {
        const rows = Number(rowsB.value);
        const cols = Number(colsB.value);

        if (rows !== cols) {
            throw new Error(
                "Determinant requires a square matrix."
            );
        }

        const B = readMatrix(matrixBGrid, rows, cols);
        const result = determinant(B);

        displayMatrixResult(
            "Determinant of Matrix B",
            formatMatrixNumber(result)
        );

        if (typeof saveMathHistory === "function") {
            saveMathHistory(
                "Matrix Determinant B",
                formatMatrix(B),
                formatMatrixNumber(result)
            );
        }

    } catch (error) {
        showMatrixError(error.message);
    }
}


// ==========================================
// MATRIX INVERSE
// ==========================================

function inverseMatrix(matrix) {
    const n = matrix.length;

    const augmented = matrix.map((row, i) => [
        ...row,
        ...Array.from(
            { length: n },
            (_, j) => i === j ? 1 : 0
        )
    ]);

    for (let i = 0; i < n; i++) {
        let pivot = i;

        for (let row = i + 1; row < n; row++) {
            if (
                Math.abs(augmented[row][i]) >
                Math.abs(augmented[pivot][i])
            ) {
                pivot = row;
            }
        }

        if (Math.abs(augmented[pivot][i]) < 1e-12) {
            throw new Error(
                "This matrix has no inverse because its determinant is zero."
            );
        }

        [augmented[i], augmented[pivot]] =
            [augmented[pivot], augmented[i]];

        const divisor = augmented[i][i];

        augmented[i] = augmented[i].map(
            value => value / divisor
        );

        for (let row = 0; row < n; row++) {
            if (row === i) continue;

            const factor = augmented[row][i];

            augmented[row] = augmented[row].map(
                (value, column) =>
                    value - factor * augmented[i][column]
            );
        }
    }

    return augmented.map(row => row.slice(n));
}


function calculateInverseA() {
    clearMatrixOutput();

    try {
        const rows = Number(rowsA.value);
        const cols = Number(colsA.value);

        if (rows !== cols) {
            throw new Error(
                "Inverse requires a square matrix."
            );
        }

        const A = readMatrix(matrixAGrid, rows, cols);
        const result = inverseMatrix(A);

        displayMatrixResult("Inverse of Matrix A", result);

        saveMatrixHistory("Inverse A", A, result);

    } catch (error) {
        showMatrixError(error.message);
    }
}


function calculateInverseB() {
    clearMatrixOutput();

    try {
        const rows = Number(rowsB.value);
        const cols = Number(colsB.value);

        if (rows !== cols) {
            throw new Error(
                "Inverse requires a square matrix."
            );
        }

        const B = readMatrix(matrixBGrid, rows, cols);
        const result = inverseMatrix(B);

        displayMatrixResult("Inverse of Matrix B", result);

        saveMatrixHistory("Inverse B", B, result);

    } catch (error) {
        showMatrixError(error.message);
    }
}


// ==========================================
// BUTTON EVENTS
// ==========================================

if (rowsA) rowsA.addEventListener("change", updateMatrixGrids);
if (colsA) colsA.addEventListener("change", updateMatrixGrids);
if (rowsB) rowsB.addEventListener("change", updateMatrixGrids);
if (colsB) colsB.addEventListener("change", updateMatrixGrids);

document.getElementById("addButton")
    ?.addEventListener("click", addMatrices);

document.getElementById("subtractButton")
    ?.addEventListener("click", subtractMatrices);

document.getElementById("multiplyButton")
    ?.addEventListener("click", multiplyMatrices);

document.getElementById("transposeAButton")
    ?.addEventListener("click", transposeA);

document.getElementById("transposeBButton")
    ?.addEventListener("click", transposeB);

document.getElementById("determinantAButton")
    ?.addEventListener("click", calculateDeterminantA);

document.getElementById("determinantBButton")
    ?.addEventListener("click", calculateDeterminantB);

document.getElementById("inverseAButton")
    ?.addEventListener("click", calculateInverseA);

document.getElementById("inverseBButton")
    ?.addEventListener("click", calculateInverseB);


// Initialize matrix grids
updateMatrixGrids();
