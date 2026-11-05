// ========================================
// MATHGENIUS - HISTORY SYSTEM
// Search, filter, delete and clear history
// ========================================

const HISTORY_KEY = "mathgenius_history";

// Get the currently logged-in user
function getHistoryUser() {
    if (typeof getCurrentUser === "function") {
        return getCurrentUser();
    }

    return null;
}

// Create a separate history key for each user
function getUserHistoryKey() {
    const user = getHistoryUser();

    if (!user || !user.email) {
        return null;
    }

    return HISTORY_KEY + "_" + user.email.toLowerCase();
}

// Get saved history
function getMathHistory() {
    const key = getUserHistoryKey();

    if (!key) {
        return [];
    }

    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        console.error("Could not read history:", error);
        return [];
    }
}

// Save history
function saveMathHistory(type, expression, result) {
    const key = getUserHistoryKey();

    if (!key) {
        return;
    }

    const history = getMathHistory();

    const newEntry = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        type: String(type),
        expression: String(expression),
        result: String(result),
        date: new Date().toISOString()
    };

    history.unshift(newEntry);

    // Keep a maximum of 200 records
    const limitedHistory = history.slice(0, 200);

    localStorage.setItem(key, JSON.stringify(limitedHistory));
}

// Format history date
function formatHistoryDate(dateValue) {
    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleString();
}

// Update history summary
function updateHistorySummary(history) {
    const totalElement = document.getElementById("totalCalculations");
    const lastActivityElement = document.getElementById("lastActivity");

    if (totalElement) {
        totalElement.textContent = history.length;
    }

    if (lastActivityElement) {
        lastActivityElement.textContent = history.length
            ? formatHistoryDate(history[0].date)
            : "No activity yet";
    }
}

// Check whether an entry matches the selected category
function matchesHistoryFilter(entry, filter) {
    if (filter === "all") {
        return true;
    }

    const type = String(entry.type || "").toLowerCase();

    if (filter === "Matrix Calculator") {
        return (
            type.startsWith("matrix calculator") ||
            type.startsWith("matrix determinant")
        );
    }

    return type === filter.toLowerCase() ||
           type.startsWith(filter.toLowerCase() + " -");
}

// Display history
function displayMathHistory() {
    const historyList = document.getElementById("historyList");

    if (!historyList) {
        return;
    }

    const history = getMathHistory();

    updateHistorySummary(history);

    const searchInput = document.getElementById("historySearch");
    const filterInput = document.getElementById("historyFilter");

    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const selectedFilter = filterInput
        ? filterInput.value
        : "all";

    const filteredHistory = history.filter(function(entry) {
        const matchesFilter = matchesHistoryFilter(entry, selectedFilter);

        const searchableText = [
            entry.type,
            entry.expression,
            entry.result,
            formatHistoryDate(entry.date)
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        return matchesFilter && matchesSearch;
    });

    historyList.innerHTML = "";

    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <h3>No calculations yet</h3>
                <p>Your saved calculations will appear here.</p>
            </div>
        `;
        return;
    }

    if (filteredHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <h3>No matching results</h3>
                <p>Try another search term or change the filter.</p>
            </div>
        `;
        return;
    }

    filteredHistory.forEach(function(entry) {
        const card = document.createElement("div");
        card.className = "history-card";

        const heading = document.createElement("h3");
        heading.textContent = entry.type || "Calculation";

        const expression = document.createElement("p");
        expression.textContent = "Expression: " + (entry.expression || "");

        const result = document.createElement("p");
        result.textContent = "Result: " + (entry.result || "");

        const date = document.createElement("small");
        date.textContent = formatHistoryDate(entry.date);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-history-button";

        deleteButton.addEventListener("click", function() {
            deleteHistoryEntry(entry.id);
        });

        card.appendChild(heading);
        card.appendChild(expression);
        card.appendChild(result);
        card.appendChild(date);
        card.appendChild(deleteButton);

        historyList.appendChild(card);
    });
}

// Delete one history entry
function deleteHistoryEntry(id) {
    const key = getUserHistoryKey();

    if (!key) {
        return;
    }

    const updatedHistory = getMathHistory().filter(function(entry) {
        return String(entry.id) !== String(id);
    });

    localStorage.setItem(key, JSON.stringify(updatedHistory));

    displayMathHistory();
}

// Clear all history
function clearMathHistory() {
    const key = getUserHistoryKey();

    if (!key) {
        return;
    }

    const history = getMathHistory();

    if (history.length === 0) {
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to delete all your calculation history?"
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(key);

    displayMathHistory();
}

// Set up search and filter
document.addEventListener("DOMContentLoaded", function() {
    const user = getHistoryUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const searchInput = document.getElementById("historySearch");
    const filterInput = document.getElementById("historyFilter");
    const clearButton = document.getElementById("clearHistoryButton");

    if (searchInput) {
        searchInput.addEventListener("input", displayMathHistory);
    }

    if (filterInput) {
        filterInput.addEventListener("change", displayMathHistory);
    }

    if (clearButton) {
        clearButton.addEventListener("click", clearMathHistory);
    }

    displayMathHistory();
});
