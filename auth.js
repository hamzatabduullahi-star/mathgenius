// ======================================
// MATHGENIUS LOCAL ACCOUNT SYSTEM
// WITH RECOVERY CODE
// ======================================

const USERS_KEY = "mathgenius_users";
const SESSION_KEY = "mathgenius_session";

// ======================================
// GET AND SAVE USERS
// ======================================

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ======================================
// DISPLAY MESSAGES
// ======================================

function showMessage(message, success = false) {
    const messageBox = document.getElementById("authMessage");

    if (!messageBox) return;

    messageBox.textContent = message;
    messageBox.style.color = success ? "#4ade80" : "#ff8585";
}

// ======================================
// PASSWORD HASHING
// ======================================

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

// ======================================
// CREATE RANDOM SALT
// ======================================

function createSalt() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));

    return Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

// ======================================
// GENERATE RECOVERY CODE
// ======================================

function generateRecoveryCode() {

    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    const randomValues = crypto.getRandomValues(
        new Uint8Array(16)
    );

    let code = "";

    randomValues.forEach(value => {
        code += characters[value % characters.length];
    });

    return code.match(/.{1,4}/g).join("-");
}

// ======================================
// NORMALIZE RECOVERY CODE
// ======================================

function normalizeRecoveryCode(code) {
    return code
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
}

// ======================================
// SHOW RECOVERY CODE
// ======================================

function showRecoveryCode(code, message) {

    const messageBox = document.getElementById("authMessage");

    if (!messageBox) {
        alert("Your MathGenius recovery code is: " + code);
        return;
    }

    messageBox.innerHTML = "";

    const container = document.createElement("div");

    container.style.cssText = `
        margin-top: 20px;
        padding: 22px;
        background: #111a30;
        border: 1px solid #4776ff;
        border-radius: 14px;
        color: #ffffff;
        text-align: center;
        width: 100%;
        box-sizing: border-box;
    `;

    const heading = document.createElement("h3");
    heading.textContent = "Your Recovery Code";

    heading.style.cssText = `
        color: #8ba8ff;
        margin-bottom: 12px;
        font-size: 20px;
    `;

    const description = document.createElement("p");
    description.textContent = message;

    description.style.cssText = `
        color: #aab6ce;
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 15px;
    `;

    const codeBox = document.createElement("div");

    codeBox.textContent = code;

    codeBox.style.cssText = `
        padding: 16px 10px;
        background: #080d1c;
        color: #45d7ff;
        border-radius: 10px;
        font-size: 18px;
        font-weight: bold;
        letter-spacing: 2px;
        overflow-wrap: anywhere;
        margin-bottom: 15px;
        user-select: all;
    `;

    const copyButton = document.createElement("button");

    copyButton.type = "button";
    copyButton.textContent = "Copy Recovery Code";

    copyButton.style.cssText = `
        padding: 12px 18px;
        background: linear-gradient(110deg, #4776ff, #9b6dff);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        width: 100%;
        margin-bottom: 12px;
    `;

    copyButton.addEventListener("click", async function () {

        try {
            await navigator.clipboard.writeText(code);

            copyButton.textContent = "Copied Successfully!";

        } catch {
            codeBox.focus?.();

            alert("Please copy your recovery code manually.");
        }

    });

    const warning = document.createElement("p");

    warning.textContent =
        "Keep this code somewhere safe. Anyone with access to it may be able to reset your password.";

    warning.style.cssText = `
        color: #ffb4b4;
        font-size: 12px;
        line-height: 1.6;
        margin: 10px 0 18px;
    `;

    const continueButton = document.createElement("button");

    continueButton.type = "button";
    continueButton.textContent = "I've Saved My Code - Continue";

    continueButton.style.cssText = `
        padding: 13px 15px;
        width: 100%;
        background: #1c9b68;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
    `;

    continueButton.addEventListener("click", function () {
        window.location.href = "dashboard.html";
    });

    container.appendChild(heading);
    container.appendChild(description);
    container.appendChild(codeBox);
    container.appendChild(copyButton);
    container.appendChild(warning);
    container.appendChild(continueButton);

    messageBox.appendChild(container);
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

        const email = document.getElementById("email")
            .value.trim().toLowerCase();

        const accountType = document.getElementById("accountType").value;

        const institution = document.getElementById("institution").value.trim();

        const password = document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

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
            showMessage("Secure password processing is unavailable.");
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

            const recoveryCode = generateRecoveryCode();

            const recoverySalt = createSalt();

            const recoveryHash = await hashPassword(
                normalizeRecoveryCode(recoveryCode),
                recoverySalt
            );

            const newUser = {

                id: crypto.randomUUID(),

                fullName,

                email,

                accountType,

                institution,

                salt,

                passwordHash,

                recoverySalt,

                recoveryHash,

                createdAt: new Date().toISOString()

            };

            users.push(newUser);

            saveUsers(users);

            sessionStorage.setItem(
                SESSION_KEY,
                JSON.stringify({
                    userId: newUser.id
                })
            );

            button.disabled = false;
            button.textContent = "Create Free Account";

            showRecoveryCode(
                recoveryCode,
                "Your account has been created successfully. Save this recovery code before entering your dashboard."
            );

        } catch (error) {

            console.error(error);

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

        const email = document.getElementById("email")
            .value.trim().toLowerCase();

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

            const enteredHash = await hashPassword(
                password,
                user.salt
            );

            if (enteredHash !== user.passwordHash) {

                showMessage("Incorrect email or password.");

                button.disabled = false;
                button.textContent = "Log In";

                return;
            }

            sessionStorage.setItem(
                SESSION_KEY,
                JSON.stringify({
                    userId: user.id
                })
            );

            // Give existing accounts a recovery code

            if (!user.recoveryHash || !user.recoverySalt) {

                const recoveryCode = generateRecoveryCode();

                const recoverySalt = createSalt();

                const recoveryHash = await hashPassword(
                    normalizeRecoveryCode(recoveryCode),
                    recoverySalt
                );

                user.recoverySalt = recoverySalt;

                user.recoveryHash = recoveryHash;

                saveUsers(users);

                button.disabled = false;
                button.textContent = "Log In";

                showRecoveryCode(
                    recoveryCode,
                    "Your account has been upgraded with password recovery. Save this new recovery code somewhere safe."
                );

                return;
            }

            showMessage("Login successful!", true);

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 800);

        } catch (error) {

            console.error(error);

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

    forgotPassword.addEventListener("click", async event => {

        event.preventDefault();

        const email = prompt(
            "Enter the email address registered with MathGenius:"
        );

        if (!email) return;

        const normalizedEmail = email.trim().toLowerCase();

        const users = getUsers();

        const user = users.find(
            item => item.email === normalizedEmail
        );

        if (!user) {

            showMessage("Account not found. Check your registered email.");

            return;
        }

        if (!user.recoveryHash || !user.recoverySalt) {

            showMessage(
                "This account does not have a recovery code yet. Log in successfully to generate one."
            );

            return;
        }

        const recoveryCode = prompt(
            "Enter your MathGenius recovery code:"
        );

        if (!recoveryCode) return;

        try {

            const enteredRecoveryHash = await hashPassword(
                normalizeRecoveryCode(recoveryCode),
                user.recoverySalt
            );

            if (enteredRecoveryHash !== user.recoveryHash) {

                showMessage("Invalid recovery code. Please try again.");

                return;
            }

            const newPassword = prompt(
                "Enter your new password (at least 8 characters):"
            );

            if (!newPassword) return;

            if (newPassword.length < 8) {

                showMessage(
                    "Your new password must contain at least 8 characters."
                );

                return;
            }

            const confirmNewPassword = prompt(
                "Confirm your new password:"
            );

            if (newPassword !== confirmNewPassword) {

                showMessage("Your passwords do not match.");

                return;
            }

            const newSalt = createSalt();

            const newPasswordHash = await hashPassword(
                newPassword,
                newSalt
            );

            user.salt = newSalt;

            user.passwordHash = newPasswordHash;

            saveUsers(users);

            showMessage(
                "Password reset successful! You can now log in with your new password.",
                true
            );

        } catch (error) {

            console.error(error);

            showMessage("Password reset failed. Please try again.");

        }

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

        return getUsers().find(
            user => user.id === session.userId
        ) || null;

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
