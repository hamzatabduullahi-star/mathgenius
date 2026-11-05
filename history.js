// =====================================
// MATHGENIUS - SAVED CALCULATIONS
// =====================================

const HISTORY_KEY = "mathgenius_history";


// Get the currently logged-in user
function getHistoryUser() {
    if (typeof getCurrentUser !== "function") {
        return null;
    }

    return getCurrentUser();
}


// Create a separate history for each account
function getUserHistoryKey() {
    const user = getHistoryUser();

    if (!user || !user.email) {
        return null;
    }

    return HISTORY_KEY + "_" + user.email.toLowerCase();
}


// Get saved calculations
function getMathHistory() {
    const key = getUserHistoryKey();

    if (!key) return [];

    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        console.error("Could not load history:", error);
        return [];
    }
}


// Save a calculation to history
// Other maths tools will use this function.
function saveMathHistory(type, expression, result) {
    const key = getUserHistoryKey();

    if (!key) {
        console.error("No logged-in user found.");
        return false;
    }

    const history = getMathHistory();

    const newEntry = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        type: String(type),
        expression: String(expression),
        result: String(result),
        date: new Date().toISOString()
    };

    history.unshift(newEntry);

    // Keep the latest 200 calculations
    const limitedHistory = history.slice(0, 200);

    localStorage.setItem(key, JSON.stringify(limitedHistory));

    return true;
}


// Format dates
function formatHistoryDate(date) {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
        return "Unknown date";
    }

    return parsedDate.toLocaleString();
}


// Display history
function displayMathHistory() {
    const historyList = document.getElementById("historyList");
    const totalCalculations = document.getElementById("totalCalculations");
    const lastActivity = document.getElementById("lastActivity");

    if (!historyList) return;

    const history = getMathHistory();

    totalCalculations.textContent = history.length;

    if (history.length > 0) {
        lastActivity.textContent = new Date(
            history[0].date
        ).toLocaleDateString();
    } else {
        lastActivity.textContent = "None";
    }

    historyList.innerHTML = "";

    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <h2>No history yet</h2>
                <p>Your saved calculations will appear here.</p>
            </div>
        `;
        return;
    }

    history.forEach(function(entry) {
        const item = document.createElement("article");
        item.className = "history-item";

        const top = document.createElement("div");
        top.className = "history-item-top";

        const type = document.createElement("span");
        type.className = "history-type";
        type.textContent = entry.type || "Calculation";

        const date = document.createElement("span");
        date.className = "history-date";
        date.textContent = formatHistoryDate(entry.date);

        top.appendChild(type);
        top.appendChild(date);

        const expression = document.createElement("p");
        expression.className = "history-expression";
        expression.textContent = entry.expression || "";

        const answer = document.createElement("p");
        answer.className = "history-answer";
        answer.textContent = "Result: " + (entry.result || "");

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-entry";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteHistoryEntry(entry.id);
        });

        item.appendChild(top);
        item.appendChild(expression);
        item.appendChild(answer);
        item.appendChild(deleteButton);

        historyList.appendChild(item);
    });
}


// Delete one calculation
function deleteHistoryEntry(id) {
    const key = getUserHistoryKey();

    if (!key) return;

    const updatedHistory = getMathHistory().filter(function(entry) {
        return entry.id !== id;
    });

    localStorage.setItem(key, JSON.stringify(updatedHistory));

    displayMathHistory();
}


// Clear all calculations
function clearMathHistory() {
    const key = getUserHistoryKey();

    if (!key) return;

    const history = getMathHistory();

    if (history.length === 0) {
        alert("Your history is already empty.");
        return;
    }

    const confirmClear = confirm(
        "Are you sure you want to delete all your saved calculations?"
    );

    if (!confirmClear) return;

    localStorage.removeItem(key);

    displayMathHistory();

    alert("Your calculation history has been cleared.");
}


// Start the history page
document.addEventListener("DOMContentLoaded", function() {
    const user = getHistoryUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    displayMathHistory();

    const clearButton = document.getElementById(
        "clearHistoryButton"
    );

    if (clearButton) {
        clearButton.addEventListener("click", clearMathHistory);
    }
});
