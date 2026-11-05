// ==========================================
// MATHGENIUS - STATISTICS CALCULATOR
// ==========================================

const dataInput = document.getElementById("dataInput");
const calculateButton = document.getElementById("calculateButton");
const clearButton = document.getElementById("clearButton");

const errorMessage = document.getElementById("errorMessage");
const resultsSection = document.getElementById("resultsSection");


// Display a result safely
function setResult(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


// Display errors
function showStatisticsError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
    }
}


// Hide errors
function clearStatisticsError() {
    if (errorMessage) {
        errorMessage.textContent = "";
        errorMessage.style.display = "none";
    }
}


// Format numbers
function formatNumber(number) {
    if (!Number.isFinite(number)) {
        return "N/A";
    }

    return Number(number.toPrecision(12)).toString();
}


// Parse user input
function parseData(input) {
    const values = input
        .trim()
        .split(/[\s,;]+/)
        .filter(value => value !== "")
        .map(Number);

    if (values.length === 0) {
        throw new Error("Please enter some numbers.");
    }

    if (values.some(value => !Number.isFinite(value))) {
        throw new Error("Please enter valid numbers only.");
    }

    return values;
}


// Calculate sum
function calculateSum(values) {
    return values.reduce((total, value) => total + value, 0);
}


// Calculate mean
function calculateMean(values) {
    return calculateSum(values) / values.length;
}


// Calculate median
function calculateMedian(values) {
    const sorted = [...values].sort((a, b) => a - b);

    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}


// Calculate mode
function calculateMode(values) {
    const frequencies = new Map();

    values.forEach(value => {
        frequencies.set(
            value,
            (frequencies.get(value) || 0) + 1
        );
    });

    const highestFrequency = Math.max(
        ...frequencies.values()
    );

    if (highestFrequency === 1) {
        return "No mode";
    }

    const modes = [...frequencies.entries()]
        .filter(entry => entry[1] === highestFrequency)
        .map(entry => entry[0]);

    return modes.map(formatNumber).join(", ");
}


// Calculate population variance
function calculatePopulationVariance(values, mean) {
    const squaredDifferences = values.map(
        value => Math.pow(value - mean, 2)
    );

    return calculateSum(squaredDifferences) / values.length;
}


// Calculate sample variance
function calculateSampleVariance(values, mean) {
    if (values.length < 2) {
        return null;
    }

    const squaredDifferences = values.map(
        value => Math.pow(value - mean, 2)
    );

    return calculateSum(squaredDifferences) / (values.length - 1);
}


// Main statistics calculation
function calculateStatistics() {
    clearStatisticsError();

    try {
        const values = parseData(dataInput.value);

        const count = values.length;
        const sum = calculateSum(values);
        const mean = calculateMean(values);
        const median = calculateMedian(values);
        const mode = calculateMode(values);

        const minimum = Math.min(...values);
        const maximum = Math.max(...values);
        const range = maximum - minimum;

        const populationVariance =
            calculatePopulationVariance(values, mean);

        const populationStandardDeviation =
            Math.sqrt(populationVariance);

        const sampleVariance =
            calculateSampleVariance(values, mean);

        const sampleStandardDeviation =
            sampleVariance === null
                ? null
                : Math.sqrt(sampleVariance);


        // Display results
        setResult("countResult", count);
        setResult("sumResult", formatNumber(sum));
        setResult("meanResult", formatNumber(mean));
        setResult("medianResult", formatNumber(median));
        setResult("modeResult", mode);
        setResult("minResult", formatNumber(minimum));
        setResult("maxResult", formatNumber(maximum));
        setResult("rangeResult", formatNumber(range));

        setResult(
            "varianceResult",
            formatNumber(populationVariance)
        );

        setResult(
            "stdDevResult",
            formatNumber(populationStandardDeviation)
        );

        setResult(
            "sampleVarianceResult",
            sampleVariance === null
                ? "N/A"
                : formatNumber(sampleVariance)
        );

        setResult(
            "sampleStdDevResult",
            sampleStandardDeviation === null
                ? "N/A"
                : formatNumber(sampleStandardDeviation)
        );


        if (resultsSection) {
            resultsSection.style.display = "block";
        }


        // Save calculation to MathGenius history
        const expression =
            "Statistics for: " + values.join(", ");

        const result = [
            "Count: " + count,
            "Sum: " + formatNumber(sum),
            "Mean: " + formatNumber(mean),
            "Median: " + formatNumber(median),
            "Mode: " + mode,
            "Minimum: " + formatNumber(minimum),
            "Maximum: " + formatNumber(maximum),
            "Range: " + formatNumber(range),
            "Population variance: " +
                formatNumber(populationVariance),
            "Population standard deviation: " +
                formatNumber(populationStandardDeviation),
            "Sample variance: " +
                (sampleVariance === null
                    ? "N/A"
                    : formatNumber(sampleVariance)),
            "Sample standard deviation: " +
                (sampleStandardDeviation === null
                    ? "N/A"
                    : formatNumber(sampleStandardDeviation))
        ].join(" | ");

        if (typeof saveMathHistory === "function") {
            saveMathHistory(
                "Statistics Calculator",
                expression,
                result
            );
        }

    } catch (error) {
        showStatisticsError(error.message);

        if (resultsSection) {
            resultsSection.style.display = "none";
        }
    }
}


// Clear calculator
function clearStatistics() {
    if (dataInput) {
        dataInput.value = "";
    }

    clearStatisticsError();

    if (resultsSection) {
        resultsSection.style.display = "none";
    }

    const resultIds = [
        "countResult",
        "sumResult",
        "meanResult",
        "medianResult",
        "modeResult",
        "minResult",
        "maxResult",
        "rangeResult",
        "varianceResult",
        "stdDevResult",
        "sampleVarianceResult",
        "sampleStdDevResult"
    ];

    resultIds.forEach(id => setResult(id, "0"));
}


// Event listeners
if (calculateButton) {
    calculateButton.addEventListener(
        "click",
        calculateStatistics
    );
}

if (clearButton) {
    clearButton.addEventListener(
        "click",
        clearStatistics
    );
}
