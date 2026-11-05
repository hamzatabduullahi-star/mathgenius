document.addEventListener("DOMContentLoaded", () => {
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

    // Display the correct input fields
    function updateEquationType() {
        if (equationType.value === "linear") {
            linearInputs.style.display = "block";
            quadraticInputs.style.display = "none";
        } else {
            linearInputs.style.display = "none";
            quadraticInputs.style.display = "block";
        }

        clearResults();
        updatePreview();
    }

    // Update equation preview
    function updatePreview() {
        const linearPreview = document.getElementById("linearPreview");
        const quadraticPreview = document.getElementById("quadraticPreview");

        if (linearPreview) {
            const a = Number(linearA.value) || 0;
            const b = Number(linearB.value) || 0;

            linearPreview.textContent =
                `${a}x ${b < 0 ? "- " + Math.abs(b) : "+ " + b} = 0`;
        }

        if (quadraticPreview) {
            const a = Number(quadraticA.value) || 0;
            const b = Number(quadraticB.value) || 0;
            const c = Number(quadraticC.value) || 0;

            quadraticPreview.textContent =
                `${a}x² ${b < 0 ? "- " + Math.abs(b) : "+ " + b + "x"} ${c < 0 ? "- " + Math.abs(c) : "+ " + c} = 0`;
        }
    }

    // Clear previous results
    function clearResults() {
        resultBox.innerHTML = "Your answer will appear here.";
        stepsBox.innerHTML = "";
    }

    // Format numbers
    function formatNumber(number) {
        if (Math.abs(number) < 1e-10) {
            return "0";
        }

        return Number(number.toFixed(8)).toString();
    }

    // Solve linear equation: ax + b = 0
    function solveLinear() {
        const a = Number(linearA.value);
        const b = Number(linearB.value);

        if (linearA.value.trim() === "" || linearB.value.trim() === "") {
            showError("Please enter both coefficients.");
            return;
        }

        if (!Number.isFinite(a) || !Number.isFinite(b)) {
            showError("Please enter valid numbers.");
            return;
        }

        let steps = `
            <h3>Step-by-Step Solution</h3>
            <p><strong>Step 1:</strong> Start with the equation:</p>
            <div class="math-step">${a}x + (${b}) = 0</div>
        `;

        if (a === 0 && b === 0) {
            resultBox.innerHTML = `
                <h3>Infinitely Many Solutions</h3>
                <p>Every value of x satisfies this equation.</p>
            `;

            steps += `
                <p><strong>Step 2:</strong> The equation becomes:</p>
                <div class="math-step">0 = 0</div>
                <p>This statement is always true, so every real number is a solution.</p>
            `;

        } else if (a === 0) {
            resultBox.innerHTML = `
                <h3>No Solution</h3>
                <p>The equation becomes ${b} = 0, which is impossible.</p>
            `;

            steps += `
                <p><strong>Step 2:</strong> Since the coefficient of x is zero:</p>
                <div class="math-step">${b} = 0</div>
                <p>This is false, so there is no solution.</p>
            `;

        } else {
            const answer = -b / a;

            resultBox.innerHTML = `
                <h3>Solution Found</h3>
                <div class="math-answer">x = ${formatNumber(answer)}</div>
            `;

            steps += `
                <p><strong>Step 2:</strong> Move the constant to the other side:</p>
                <div class="math-step">${a}x = ${-b}</div>

                <p><strong>Step 3:</strong> Divide both sides by ${a}:</p>
                <div class="math-step">x = ${-b} ÷ ${a}</div>

                <p><strong>Final Answer:</strong></p>
                <div class="math-answer">x = ${formatNumber(answer)}</div>
            `;
        }

        stepsBox.innerHTML = steps;
    }

    // Solve quadratic equation: ax² + bx + c = 0
    function solveQuadratic() {
        const a = Number(quadraticA.value);
        const b = Number(quadraticB.value);
        const c = Number(quadraticC.value);

        if (
            quadraticA.value.trim() === "" ||
            quadraticB.value.trim() === "" ||
            quadraticC.value.trim() === ""
        ) {
            showError("Please enter all three coefficients.");
            return;
        }

        if (![a, b, c].every(Number.isFinite)) {
            showError("Please enter valid numbers.");
            return;
        }

        if (a === 0) {
            resultBox.innerHTML = `
                <h3>Not a Quadratic Equation</h3>
                <p>The coefficient of x² cannot be zero.</p>
                <p>This equation is linear or constant.</p>
            `;
            stepsBox.innerHTML = "";
            return;
        }

        const discriminant = b * b - 4 * a * c;

        let steps = `
            <h3>Step-by-Step Solution</h3>

            <p><strong>Step 1:</strong> Start with the equation:</p>
            <div class="math-step">
                ${a}x² + (${b})x + (${c}) = 0
            </div>

            <p><strong>Step 2:</strong> Identify the coefficients:</p>
            <div class="math-step">
                a = ${a}, b = ${b}, c = ${c}
            </div>

            <p><strong>Step 3:</strong> Calculate the discriminant:</p>
            <div class="math-step">
                D = b² - 4ac
            </div>

            <div class="math-step">
                D = (${b})² - 4(${a})(${c})
            </div>

            <div class="math-step">
                D = ${formatNumber(discriminant)}
            </div>
        `;

        if (discriminant > 0) {
            const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);

            resultBox.innerHTML = `
                <h3>Two Real Solutions</h3>
                <div class="math-answer">
                    x₁ = ${formatNumber(root1)}
                </div>
                <div class="math-answer">
                    x₂ = ${formatNumber(root2)}
                </div>
            `;

            steps += `
                <p><strong>Step 4:</strong> Since D is positive, there are two different real roots.</p>

                <p>Using the quadratic formula:</p>
                <div class="math-step">
                    x = (-b ± √D) / 2a
                </div>

                <p><strong>Final Answers:</strong></p>
                <div class="math-answer">
                    x₁ = ${formatNumber(root1)}
                </div>
                <div class="math-answer">
                    x₂ = ${formatNumber(root2)}
                </div>
            `;

        } else if (discriminant === 0) {
            const root = -b / (2 * a);

            resultBox.innerHTML = `
                <h3>One Repeated Real Solution</h3>
                <div class="math-answer">
                    x = ${formatNumber(root)}
                </div>
            `;

            steps += `
                <p><strong>Step 4:</strong> Since D equals zero, both roots are equal.</p>
                <div class="math-step">
                    x = -b / 2a
                </div>
                <div class="math-answer">
                    x = ${formatNumber(root)}
                </div>
            `;

        } else {
            const realPart = -b / (2 * a);
            const imaginaryPart = Math.sqrt(-discriminant) / Math.abs(2 * a);

            const sign = imaginaryPart < 0 ? "-" : "+";

            resultBox.innerHTML = `
                <h3>Two Complex Solutions</h3>
                <div class="math-answer">
                    x₁ = ${formatNumber(realPart)} + ${formatNumber(imaginaryPart)}i
                </div>
                <div class="math-answer">
                    x₂ = ${formatNumber(realPart)} - ${formatNumber(imaginaryPart)}i
                </div>
                <p>This equation has no real-number roots.</p>
            `;

            steps += `
                <p><strong>Step 4:</strong> Since D is negative, the equation has two complex roots.</p>

                <p>The real part is:</p>
                <div class="math-step">
                    -b / 2a = ${formatNumber(realPart)}
                </div>

                <p>The imaginary part is:</p>
                <div class="math-step">
                    √|D| / |2a| = ${formatNumber(imaginaryPart)}
                </div>

                <p><strong>Final Answers:</strong></p>
                <div class="math-answer">
                    x₁ = ${formatNumber(realPart)} + ${formatNumber(imaginaryPart)}i
                </div>
                <div class="math-answer">
                    x₂ = ${formatNumber(realPart)} - ${formatNumber(imaginaryPart)}i
                </div>
            `;
        }

        stepsBox.innerHTML = steps;
    }

    // Show error message
    function showError(message) {
        resultBox.innerHTML = `
            <h3>Input Error</h3>
            <p>${message}</p>
        `;

        stepsBox.innerHTML = "";
    }

    // Solve button
    solveButton.addEventListener("click", () => {
        clearResults();

        if (equationType.value === "linear") {
            solveLinear();
        } else {
            solveQuadratic();
        }
    });

    // Update preview when inputs change
    [
        linearA,
        linearB,
        quadraticA,
        quadraticB,
        quadraticC
    ].forEach(input => {
        input.addEventListener("input", updatePreview);
    });

    equationType.addEventListener("change", updateEquationType);

    // Initial setup
    updateEquationType();
});
