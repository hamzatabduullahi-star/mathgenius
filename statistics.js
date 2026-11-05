document.addEventListener("DOMContentLoaded", () => {
    const dataInput = document.getElementById("dataInput");
    const calculateButton = document.getElementById("calculateButton");
    const clearButton = document.getElementById("clearButton");

    const errorMessage = document.getElementById("errorMessage");
    const resultsSection = document.getElementById("resultsSection");

    // Format numbers neatly
    function formatNumber(number) {
        if (!Number.isFinite(number)) return "N/A";

        if (Math.abs(number) < 1e-10) {
            return "0";
        }

        return Number(number.toFixed(8)).toString();
    }

    // Display a result
    function displayResult(id, value) {
        document.getElementById(id).textContent = value;
    }

    // Calculate mode
    function calculateMode(numbers) {
        const frequency = new Map();

        numbers.forEach(number => {
            frequency.set(number, (frequency.get(number) || 0) + 1);
        });

        const highestFrequency = Math.max(...frequency.values());

        // If every number appears once, there is no mode
        if (highestFrequency === 1) {
            return "No mode";
        }

        const modes = [];

        frequency.forEach((count, number) => {
            if (count === highestFrequency) {
                modes.push(number);
            }
        });

        return modes
            .sort((a, b) => a - b)
            .map(formatNumber)
            .join(", ");
    }

    // Calculate statistics
    function calculateStatistics() {
        errorMessage.textContent = "";
        resultsSection.hidden = true;

        const rawData = dataInput.value.trim();

        if (!rawData) {
            errorMessage.textContent = "Please enter some numbers.";
            return;
        }

        // Accept commas, spaces and new lines
        const values = rawData.split(/[\s,]+/).filter(Boolean);

        const numbers = values.map(value => Number(value));

        if (numbers.some(number => !Number.isFinite(number))) {
            errorMessage.textContent =
                "Invalid data. Please enter numbers only.";
            return;
        }

        if (numbers.length > 10000) {
            errorMessage.textContent =
                "Please enter no more than 10,000 numbers.";
            return;
        }

        const sorted = [...numbers].sort((a, b) => a - b);

        const count = numbers.length;
        const sum = numbers.reduce((total, number) => total + number, 0);

        if (!Number.isFinite(sum)) {
            errorMessage.textContent =
                "The numbers are too large to calculate safely.";
            return;
        }

        // Mean
        const mean = sum / count;

        // Median
        let median;

        if (count % 2 === 0) {
            median = (
                sorted[count / 2 - 1] +
                sorted[count / 2]
            ) / 2;
        } else {
            median = sorted[Math.floor(count / 2)];
        }

        // Mode
        const mode = calculateMode(numbers);

        // Minimum and maximum
        const minimum = sorted[0];
        const maximum = sorted[count - 1];

        // Range
        const range = maximum - minimum;

        // Population variance
        const squaredDifferences = numbers.map(number =>
            (number - mean) ** 2
        );

        const populationVariance =
            squaredDifferences.reduce((total, value) => total + value, 0) / count;

        const populationStdDev = Math.sqrt(populationVariance);

        // Sample variance and standard deviation
        let sampleVariance = "N/A";
        let sampleStdDev = "N/A";

        if (count > 1) {
            const calculatedSampleVariance =
                squaredDifferences.reduce(
                    (total, value) => total + value,
                    0
                ) / (count - 1);

            sampleVariance = formatNumber(calculatedSampleVariance);
            sampleStdDev = formatNumber(Math.sqrt(calculatedSampleVariance));
        }

        // Display all results
        displayResult("countResult", count);
        displayResult("sumResult", formatNumber(sum));
        displayResult("meanResult", formatNumber(mean));
        displayResult("medianResult", formatNumber(median));
        displayResult("modeResult", mode);
        displayResult("minResult", formatNumber(minimum));
        displayResult("maxResult", formatNumber(maximum));
        displayResult("rangeResult", formatNumber(range));

        displayResult(
            "varianceResult",
            formatNumber(populationVariance)
        );

        displayResult(
            "stdDevResult",
            formatNumber(populationStdDev)
        );

        displayResult("sampleVarianceResult", sampleVariance);
        displayResult("sampleStdDevResult", sampleStdDev);

        resultsSection.hidden = false;
    }

    // Clear everything
    function clearCalculator() {
        dataInput.value = "";
        errorMessage.textContent = "";
        resultsSection.hidden = true;
    }

    calculateButton.addEventListener("click", calculateStatistics);
    clearButton.addEventListener("click", clearCalculator);

    // Allow Ctrl + Enter to calculate
    dataInput.addEventListener("keydown", event => {
        if (event.ctrlKey && event.key === "Enter") {
            calculateStatistics();
        }
    });
});
