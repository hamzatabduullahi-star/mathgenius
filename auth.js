// ======================================
// MATHGENIUS LOCAL ACCOUNT SYSTEM
// ======================================

const USERS_KEY = "mathgenius_users";
const SESSION_KEY = "mathgenius_session";

// Get registered users
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
        return [];
    }
}

// Save registered users
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Display messages
function showMessage(message, success = false) {
    const messageBox = document.getElementById("authMessage");

    if (!messageBox) return;

    messageBox.textContent = message;
    messageBox.style.color = success ? "#4ade80" : "#ff8585";
}

// Hash passwords before storing them
async function hashPassword(password, salt) {
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    );

    const bits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: encoder.encode(salt),
            iterations: 150000,
            hash: "SHA-256"
        },
        key,
        256
    );

    return Array.from(new Uint8Array(bits))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

// Create a random password salt
function createSalt() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));

    return Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

// ======================================
// REGISTRATION
// ======================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async event => {
        event.preventDefault();

        const button = document.getElementById("registerButton");

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const accountType = document.getElementById("accountType").value;
        const institution = document.getElementById("institution").value.trim();

        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!fullName || !email || !accountType || !password) {
            showMessage("Please complete all required fields.");
            return;
        }

        if (password.length < 8) {
            showMessage("Your password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Your passwords do not match.");
            return;
        }

        if (!crypto.subtle) {
            showMessage("Secure password processing is unavailable in this browser.");
            return;
        }

        const users = getUsers();

        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            showMessage("An account with this email already exists.");
            return;
        }

        button.disabled = true;
        button.textContent = "Creating Account...";

        try {
            const salt = createSalt();
            const passwordHash = await hashPassword(password, salt);

            const newUser = {
                id: crypto.randomUUID(),
                fullName,
                email,
                accountType,
                institution,
                salt,
                passwordHash,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            saveUsers(users);

            sessionStorage.setItem(SESSION_KEY, JSON.stringify({
                userId: newUser.id
            }));

            showMessage("Account created successfully!", true);

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);

        } catch (error) {
            showMessage("Something went wrong. Please try again.");
            button.disabled = false;
            button.textContent = "Create Free Account";
        }
    });
}

// ======================================
// LOGIN
// ======================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async event => {
        event.preventDefault();

        const button = document.getElementById("loginButton");

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        if (!email || !password) {
            showMessage("Please enter your email and password.");
            return;
        }

        button.disabled = true;
        button.textContent = "Logging in...";

        try {
            const users = getUsers();

            const user = users.find(item => item.email === email);

            if (!user) {
                showMessage("Incorrect email or password.");
                button.disabled = false;
                button.textContent = "Log In";
                return;
            }

            const enteredHash = await hashPassword(password, user.salt);

            if (enteredHash !== user.passwordHash) {
                showMessage("Incorrect email or password.");
                button.disabled = false;
                button.textContent = "Log In";
                return;
            }

            sessionStorage.setItem(SESSION_KEY, JSON.stringify({
                userId: user.id
            }));

            showMessage("Login successful!", true);

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 800);

        } catch (error) {
            showMessage("Unable to log in. Please try again.");
            button.disabled = false;
            button.textContent = "Log In";
        }
    });
}

// ======================================
// FORGOT PASSWORD
// ======================================

const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {
    forgotPassword.addEventListener("click", event => {
        event.preventDefault();

        showMessage(
            "Password recovery isn't available in local mode. Your account has no email recovery service."
        );
    });
}

// ======================================
// CURRENT USER
// ======================================

function getCurrentUser() {
    try {
        const session = JSON.parse(
            sessionStorage.getItem(SESSION_KEY)
        );

        if (!session) return null;

        return getUsers().find(user => user.id === session.userId) || null;

    } catch {
        return null;
    }
}

// ======================================
// LOGOUT
// ======================================

function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
}

// ======================================
// PROTECT DASHBOARD PAGES
// ======================================

function requireLogin() {
    if (!getCurrentUser()) {
        window.location.href = "login.html";
    }
}

// ======================================
// LOGGED-IN USER DISPLAY
// ======================================

function displayCurrentUser() {
    const user = getCurrentUser();

    if (!user) return;

    const nameElement = document.getElementById("userName");
    const emailElement = document.getElementById("userEmail");
    const roleElement = document.getElementById("userRole");

    if (nameElement) {
        nameElement.textContent = user.fullName;
    }

    if (emailElement) {
        emailElement.textContent = user.email;
    }

    if (roleElement) {
        roleElement.textContent = user.accountType;
    }
}
