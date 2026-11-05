document.addEventListener("DOMContentLoaded", () => {
    const rowsA = document.getElementById("rowsA");
    const colsA = document.getElementById("colsA");
    const rowsB = document.getElementById("rowsB");
    const colsB = document.getElementById("colsB");

    const gridA = document.getElementById("matrixAGrid");
    const gridB = document.getElementById("matrixBGrid");

    const matrixError = document.getElementById("matrixError");
    const matrixResult = document.getElementById("matrixResult");

    // Create matrix input fields
    function createMatrix(grid, rows, cols, prefix) {
        grid.innerHTML = "";
        grid.style.gridTemplateColumns = `repeat(${cols}, 65px)`;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const input = document.createElement("input");

                input.type = "number";
                input.step = "any";
                input.value = r === c ? "1" : "0";
                input.placeholder = "0";
                input.setAttribute("aria-label", `${prefix} row ${r + 1}, column ${c + 1}`);

                grid.appendChild(input);
            }
        }
    }

    // Read matrix values
    function readMatrix(grid, rows, cols) {
        const inputs = [...grid.querySelectorAll("input")];
        const matrix = [];

        for (let r = 0; r < rows; r++) {
            const row = [];

            for (let c = 0; c < cols; c++) {
                const input = inputs[r * cols + c];

                if (input.value.trim() === "") {
                    throw new Error(
                        `Please fill in every matrix cell. Missing value at row ${r + 1}, column ${c + 1}.`
                    );
                }

                const value = Number(input.value);

                if (!Number.isFinite(value)) {
                    throw new Error("Please enter valid numbers only.");
                }

                row.push(value);
            }

            matrix.push(row);
        }

        return matrix;
    }

    // Display an error
    function showError(message) {
        matrixError.textContent = message;
        matrixResult.innerHTML = `
            <h3>Result</h3>
            <p>Your matrix result will appear here.</p>
        `;
    }

    // Format numbers
    function formatNumber(number) {
        if (!Number.isFinite(number)) return "Undefined";
        if (Math.abs(number) < 1e-10) return "0";

        return Number(number.toFixed(8)).toString();
    }

    // Display matrix result
    function displayMatrix(title, matrix) {
        matrixError.textContent = "";

        let html = `<h3>${title}</h3><table><tbody>`;

        matrix.forEach(row => {
            html += "<tr>";

            row.forEach(value => {
                html += `<td>${formatNumber(value)}</td>`;
            });

            html += "</tr>";
        });

        html += "</tbody></table>";

        matrixResult.innerHTML = html;
    }

    // Display a single number
    function displayNumber(title, value) {
        matrixError.textContent = "";

        matrixResult.innerHTML = `
            <h3>${title}</h3>
            <div style="font-size: 25px; font-weight: bold; margin-top: 15px;">
                ${formatNumber(value)}
            </div>
        `;
    }

    // Check whether matrices have matching dimensions
    function sameDimensions(A, B) {
        return (
            A.length === B.length &&
            A[0].length === B[0].length
        );
    }

    // Matrix addition
    function addMatrices(A, B) {
        return A.map((row, r) =>
            row.map((value, c) => value + B[r][c])
        );
    }

    // Matrix subtraction
    function subtractMatrices(A, B) {
        return A.map((row, r) =>
            row.map((value, c) => value - B[r][c])
        );
    }

    // Matrix multiplication
    function multiplyMatrices(A, B) {
        const result = [];

        for (let r = 0; r < A.length; r++) {
            const row = [];

            for (let c = 0; c < B[0].length; c++) {
                let sum = 0;

                for (let k = 0; k < B.length; k++) {
                    sum += A[r][k] * B[k][c];
                }

                row.push(sum);
            }

            result.push(row);
        }

        return result;
    }

    // Matrix transpose
    function transposeMatrix(A) {
        return A[0].map((_, c) =>
            A.map(row => row[c])
        );
    }

    // Calculate determinant recursively
    function determinant(A) {
        const n = A.length;

        if (n === 1) {
            return A[0][0];
        }

        if (n === 2) {
            return (
                A[0][0] * A[1][1] -
                A[0][1] * A[1][0]
            );
        }

        let result = 0;

        for (let c = 0; c < n; c++) {
            const minor = A.slice(1).map(row =>
                row.filter((_, index) => index !== c)
            );

            result +=
                (c % 2 === 0 ? 1 : -1) *
                A[0][c] *
                determinant(minor);
        }

        return result;
    }

    // Calculate matrix inverse using Gauss-Jordan elimination
    function inverseMatrix(A) {
        const n = A.length;

        if (A.some(row => row.length !== n)) {
            throw new Error("Only square matrices have an inverse.");
        }

        const augmented = A.map((row, r) => [
            ...row,
            ...Array.from({ length: n }, (_, c) => r === c ? 1 : 0)
        ]);

        for (let i = 0; i < n; i++) {
            // Find the strongest pivot
            let pivotRow = i;

            for (let r = i + 1; r < n; r++) {
                if (
                    Math.abs(augmented[r][i]) >
                    Math.abs(augmented[pivotRow][i])
                ) {
                    pivotRow = r;
                }
            }

            if (Math.abs(augmented[pivotRow][i]) < 1e-12) {
                throw new Error(
                    "This matrix has no inverse because its determinant is zero."
                );
            }

            // Swap rows if necessary
            [augmented[i], augmented[pivotRow]] =
                [augmented[pivotRow], augmented[i]];

            // Make pivot equal to 1
            const pivot = augmented[i][i];

            for (let c = 0; c < 2 * n; c++) {
                augmented[i][c] /= pivot;
            }

            // Eliminate other values in pivot column
            for (let r = 0; r < n; r++) {
                if (r === i) continue;

                const factor = augmented[r][i];

                for (let c = 0; c < 2 * n; c++) {
                    augmented[r][c] -= factor * augmented[i][c];
                }
            }
        }

        return augmented.map(row => row.slice(n));
    }

    // Get Matrix A
    function getA() {
        return readMatrix(
            gridA,
            Number(rowsA.value),
            Number(colsA.value)
        );
    }

    // Get Matrix B
    function getB() {
        return readMatrix(
            gridB,
            Number(rowsB.value),
            Number(colsB.value)
        );
    }

    // Run an operation safely
    function runOperation(operation) {
        try {
            matrixError.textContent = "";
            operation();
        } catch (error) {
            showError(error.message);
        }
    }

    // Addition
    document.getElementById("addButton").addEventListener("click", () => {
        runOperation(() => {
            const A = getA();
            const B = getB();

            if (!sameDimensions(A, B)) {
                throw new Error(
                    "Addition requires both matrices to have the same dimensions."
                );
            }

            displayMatrix("A + B", addMatrices(A, B));
        });
    });

    // Subtraction
    document.getElementById("subtractButton").addEventListener("click", () => {
        runOperation(() => {
            const A = getA();
            const B = getB();

            if (!sameDimensions(A, B)) {
                throw new Error(
                    "Subtraction requires both matrices to have the same dimensions."
                );
            }

            displayMatrix("A − B", subtractMatrices(A, B));
        });
    });

    // Multiplication
    document.getElementById("multiplyButton").addEventListener("click", () => {
        runOperation(() => {
            const A = getA();
            const B = getB();

            if (A[0].length !== B.length) {
                throw new Error(
                    "For multiplication, columns of Matrix A must equal rows of Matrix B."
                );
            }

            displayMatrix("A × B", multiplyMatrices(A, B));
        });
    });

    // Transpose A
    document.getElementById("transposeAButton").addEventListener("click", () => {
        runOperation(() => {
            displayMatrix("Transpose of A", transposeMatrix(getA()));
        });
    });

    // Transpose B
    document.getElementById("transposeBButton").addEventListener("click", () => {
        runOperation(() => {
            displayMatrix("Transpose of B", transposeMatrix(getB()));
        });
    });

    // Determinant A
    document.getElementById("determinantAButton").addEventListener("click", () => {
        runOperation(() => {
            const A = getA();

            if (A.length !== A[0].length) {
                throw new Error("Determinant requires a square matrix.");
            }

            displayNumber("Determinant of A", determinant(A));
        });
    });

    // Determinant B
    document.getElementById("determinantBButton").addEventListener("click", () => {
        runOperation(() => {
            const B = getB();

            if (B.length !== B[0].length) {
                throw new Error("Determinant requires a square matrix.");
            }

            displayNumber("Determinant of B", determinant(B));
        });
    });

    // Inverse A
    document.getElementById("inverseAButton").addEventListener("click", () => {
        runOperation(() => {
            displayMatrix("Inverse of A", inverseMatrix(getA()));
        });
    });

    // Inverse B
    document.getElementById("inverseBButton").addEventListener("click", () => {
        runOperation(() => {
            displayMatrix("Inverse of B", inverseMatrix(getB()));
        });
    });

    // Rebuild matrices when dimensions change
    function rebuildMatrices() {
        createMatrix(
            gridA,
            Number(rowsA.value),
            Number(colsA.value),
            "Matrix A"
        );

        createMatrix(
            gridB,
            Number(rowsB.value),
            Number(colsB.value),
            "Matrix B"
        );

        matrixError.textContent = "";
        matrixResult.innerHTML = `
            <h3>Result</h3>
            <p>Your matrix result will appear here.</p>
        `;
    }

    [rowsA, colsA, rowsB, colsB].forEach(select => {
        select.addEventListener("change", rebuildMatrices);
    });

    // Initial matrices
    rebuildMatrices();
});
