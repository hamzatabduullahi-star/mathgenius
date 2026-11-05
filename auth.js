// ==========================================
// MATHGENIUS - IMPROVED LOCAL ACCOUNT SYSTEM
// Persistent Sessions + Recovery Codes
// ==========================================

const USERS_KEY = "mathgenius_users";
const SESSION_KEY = "mathgenius_session";


// ==========================================
// USER STORAGE
// ==========================================

function getUsers() {
    try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY));

        return Array.isArray(users) ? users : [];

    } catch (error) {
        console.error("Unable to read accounts:", error);
        return [];
    }
}


function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}


function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
}


// ==========================================
// SESSION MANAGEMENT
// ==========================================

function saveSession(userId) {

    const session = JSON.stringify({
        userId: userId,
        createdAt: new Date().toISOString()
    });

    localStorage.setItem(SESSION_KEY, session);

    // Remove an older temporary session if present.
    sessionStorage.removeItem(SESSION_KEY);
}


function getSavedSession() {

    try {

        // First check persistent session.
        let session = localStorage.getItem(SESSION_KEY);

        // Support an older session created by previous versions.
        if (!session) {

            session = sessionStorage.getItem(SESSION_KEY);

            if (session) {
                localStorage.setItem(SESSION_KEY, session);
                sessionStorage.removeItem(SESSION_KEY);
            }
        }

        return session ? JSON.parse(session) : null;

    } catch (error) {

        console.error("Session error:", error);

        return null;
    }
}


// ==========================================
// DISPLAY MESSAGES
// ==========================================

function showMessage(message, success = false) {

    const messageBox = document.getElementById("authMessage");

    if (!messageBox) return;

    messageBox.textContent = message;

    messageBox.style.color =
        success ? "#4ade80" : "#ff8585";
}


// ==========================================
// PASSWORD HASHING
// ==========================================

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


// ==========================================
// CREATE RANDOM SALT
// ==========================================

function createSalt() {

    const bytes = crypto.getRandomValues(
        new Uint8Array(16)
    );

    return Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


// ==========================================
// SECURE HASH COMPARISON
// ==========================================

function hashesMatch(first, second) {

    if (
        typeof first !== "string" ||
        typeof second !== "string" ||
        first.length !== second.length
    ) {
        return false;
    }

    let difference = 0;

    for (let i = 0; i < first.length; i++) {

        difference |=
            first.charCodeAt(i) ^ second.charCodeAt(i);

    }

    return difference === 0;
}


// ==========================================
// RECOVERY CODE
// ==========================================

function generateRecoveryCode() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    const randomValues = crypto.getRandomValues(
        new Uint8Array(16)
    );

    let code = "";

    randomValues.forEach(value => {

        code += characters[value % characters.length];

    });

    return code.match(/.{1,4}/g).join("-");
}


function normalizeRecoveryCode(code) {

    return String(code || "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");

}


// ==========================================
// SHOW RECOVERY CODE
// ==========================================

function showRecoveryCode(code, message) {

    const messageBox =
        document.getElementById("authMessage");

    if (!messageBox) {

        alert("Your MathGenius recovery code is: " + code);

        return;
    }

    messageBox.innerHTML = "";

    const container = document.createElement("div");

    container.style.cssText = `
        margin-top:20px;
        padding:22px;
        background:#111a30;
        border:1px solid #4776ff;
        border-radius:14px;
        color:white;
        text-align:center;
        width:100%;
        box-sizing:border-box;
    `;

    const heading = document.createElement("h3");

    heading.textContent = "Your Recovery Code";

    const description = document.createElement("p");

    description.textContent = message;

    const codeBox = document.createElement("div");

    codeBox.textContent = code;

    codeBox.style.cssText = `
        padding:16px 10px;
        background:#080d1c;
        color:#45d7ff;
        border-radius:10px;
        font-size:18px;
        font-weight:bold;
        letter-spacing:2px;
        overflow-wrap:anywhere;
        margin:15px 0;
        user-select:all;
    `;

    const copyButton = document.createElement("button");

    copyButton.type = "button";
    copyButton.textContent = "Copy Recovery Code";

    copyButton.style.cssText = `
        padding:12px;
        width:100%;
        background:linear-gradient(110deg,#4776ff,#9b6dff);
        color:white;
        border:none;
        border-radius:8px;
        font-weight:bold;
        margin-bottom:12px;
    `;

    copyButton.addEventListener("click", async function () {

        try {

            await navigator.clipboard.writeText(code);

            copyButton.textContent = "Copied Successfully!";

        } catch {

            alert("Please select and copy your recovery code manually.");

        }

    });

    const warning = document.createElement("p");

    warning.textContent =
        "Keep this code somewhere safe. Anyone with access to it may be able to reset your password.";

    warning.style.cssText = `
        color:#ffb4b4;
        font-size:12px;
        line-height:1.6;
        margin:10px 0 18px;
    `;

    const continueButton = document.createElement("button");

    continueButton.type = "button";

    continueButton.textContent =
        "I've Saved My Code - Continue";

    continueButton.style.cssText = `
        padding:13px;
        width:100%;
        background:#1c9b68;
        color:white;
        border:none;
        border-radius:8px;
        font-weight:bold;
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


// ==========================================
// REGISTRATION
// ==========================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async event => {

        event.preventDefault();

        const button =
            document.getElementById("registerButton");

        const fullName =
            document.getElementById("fullName").value.trim();

        const email = normalizeEmail(
            document.getElementById("email").value
        );

        const accountType =
            document.getElementById("accountType").value;

        const institution =
            document.getElementById("institution").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (!fullName || !email || !accountType || !password) {

            showMessage("Please complete all required fields.");

            return;
        }

        if (password.length < 8) {

            showMessage("Password must contain at least 8 characters.");

            return;
        }

        if (password !== confirmPassword) {

            showMessage("Your passwords do not match.");

            return;
        }

        if (!crypto.subtle || !crypto.randomUUID) {

            showMessage(
                "Your browser does not support the required security features."
            );

            return;
        }

        const users = getUsers();

        if (users.some(user =>
            normalizeEmail(user.email) === email
        )) {

            showMessage("An account with this email already exists.");

            return;
        }

        button.disabled = true;
        button.textContent = "Creating Account...";

        try {

            const salt = createSalt();

            const passwordHash =
                await hashPassword(password, salt);

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

            saveSession(newUser.id);

            button.disabled = false;
            button.textContent = "Create Free Account";

            showRecoveryCode(
                recoveryCode,
                "Your account has been created successfully. Save this recovery code before entering your dashboard."
            );

        } catch (error) {

            console.error(error);

            showMessage(
                "Something went wrong. Please try again."
            );

            button.disabled = false;
            button.textContent = "Create Free Account";

        }

    });

}


// ==========================================
// LOGIN
// ==========================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async event => {

        event.preventDefault();

        const button =
            document.getElementById("loginButton");

        const email = normalizeEmail(
            document.getElementById("email").value
        );

        const password =
            document.getElementById("password").value;

        if (!email || !password) {

            showMessage("Please enter your email and password.");

            return;
        }

        if (!crypto.subtle) {

            showMessage(
                "Secure password verification is unavailable. Open the official HTTPS website."
            );

            return;
        }

        button.disabled = true;
        button.textContent = "Checking Account...";

        try {

            const users = getUsers();

            const user = users.find(item =>
                normalizeEmail(item.email) === email
            );

            if (!user) {

                showMessage("Incorrect email or password.");

                return;
            }

            if (!user.salt || !user.passwordHash) {

                showMessage(
                    "This account's password information is incomplete."
                );

                return;
            }

            const enteredHash = await hashPassword(
                password,
                user.salt
            );

            if (!hashesMatch(enteredHash, user.passwordHash)) {

                showMessage("Incorrect email or password.");

                return;
            }

            saveSession(user.id);

            // Generate recovery code for older accounts.

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

                showRecoveryCode(
                    recoveryCode,
                    "Your account now has password recovery enabled. Save this code somewhere safe."
                );

                return;
            }

            showMessage("Login successful!", true);

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 600);

        } catch (error) {

            console.error("Login error:", error);

            showMessage(
                "Unable to verify your account. Please try again."
            );

        } finally {

            button.disabled = false;

            button.textContent = "Log In";

        }

    });

}


// ==========================================
// FORGOT PASSWORD
// ==========================================

const forgotPassword =
    document.getElementById("forgotPassword");

if (forgotPassword) {

    forgotPassword.addEventListener("click", async event => {

        event.preventDefault();

        const email = prompt(
            "Enter your registered MathGenius email:"
        );

        if (!email) return;

        const normalizedEmail = normalizeEmail(email);

        const users = getUsers();

        const user = users.find(item =>
            normalizeEmail(item.email) === normalizedEmail
        );

        if (!user) {

            showMessage("Account not found.");

            return;
        }

        if (!user.recoveryHash || !user.recoverySalt) {

            showMessage(
                "Log in successfully first to generate your recovery code."
            );

            return;
        }

        const recoveryCode = prompt(
            "Enter your MathGenius recovery code:"
        );

        if (!recoveryCode) return;

        try {

            const enteredHash = await hashPassword(
                normalizeRecoveryCode(recoveryCode),
                user.recoverySalt
            );

            if (!hashesMatch(enteredHash, user.recoveryHash)) {

                showMessage("Invalid recovery code.");

                return;
            }

            const newPassword = prompt(
                "Enter your new password (at least 8 characters):"
            );

            if (!newPassword) return;

            if (newPassword.length < 8) {

                showMessage("Password must contain at least 8 characters.");

                return;
            }

            const confirmation = prompt(
                "Confirm your new password:"
            );

            if (newPassword !== confirmation) {

                showMessage("Your passwords do not match.");

                return;
            }

            const newSalt = createSalt();

            const newHash = await hashPassword(
                newPassword,
                newSalt
            );

            user.salt = newSalt;
            user.passwordHash = newHash;

            saveUsers(users);

            showMessage(
                "Password reset successful! You can now log in.",
                true
            );

        } catch (error) {

            console.error(error);

            showMessage("Password reset failed.");

        }

    });

}


// ==========================================
// GET CURRENT USER
// ==========================================

function getCurrentUser() {

    const session = getSavedSession();

    if (!session || !session.userId) {
        return null;
    }

    return getUsers().find(
        user => user.id === session.userId
    ) || null;

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem(SESSION_KEY);

    sessionStorage.removeItem(SESSION_KEY);

    window.location.href = "login.html";

}


// ==========================================
// PROTECT PAGES
// ==========================================

function requireLogin() {

    if (!getCurrentUser()) {

        window.location.href = "login.html";

    }

}


// ==========================================
// DISPLAY USER DETAILS
// ==========================================

function displayCurrentUser() {

    const user = getCurrentUser();

    if (!user) return;

    const nameElement =
        document.getElementById("userName");

    const emailElement =
        document.getElementById("userEmail");

    const roleElement =
        document.getElementById("userRole");

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
