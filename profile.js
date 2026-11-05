document.addEventListener("DOMContentLoaded", () => {

    // Check whether the user is logged in
    const user = getCurrentUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Get page elements
    const profileForm = document.getElementById("profileForm");
    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const accountTypeInput = document.getElementById("accountType");
    const institutionInput = document.getElementById("institution");

    const profileAvatar = document.getElementById("profileAvatar");
    const profileDisplayName = document.getElementById("profileDisplayName");

    const accountId = document.getElementById("accountId");
    const createdAt = document.getElementById("createdAt");

    const profileMessage = document.getElementById("profileMessage");
    const saveButton = document.getElementById("saveProfileButton");
    const logoutButton = document.getElementById("logoutButton");

    // Display profile information
    function loadProfile() {
        fullNameInput.value = user.fullName || "";
        emailInput.value = user.email || "";
        accountTypeInput.value = user.accountType || "student";
        institutionInput.value = user.institution || "";

        profileDisplayName.textContent = user.fullName || "My Account";

        profileAvatar.textContent =
            (user.fullName || "M").charAt(0).toUpperCase();

        accountId.textContent = user.id || "Unavailable";

        if (user.createdAt) {
            createdAt.textContent = new Date(
                user.createdAt
            ).toLocaleDateString();
        } else {
            createdAt.textContent = "Unavailable";
        }
    }

    // Display success or error messages
    function showProfileMessage(message, success = false) {
        profileMessage.textContent = message;
        profileMessage.style.color = success ? "#4ade80" : "#ff8585";
    }

    // Save profile changes
    profileForm.addEventListener("submit", event => {
        event.preventDefault();

        const newName = fullNameInput.value.trim();
        const newInstitution = institutionInput.value.trim();

        if (!newName) {
            showProfileMessage("Please enter your full name.");
            return;
        }

        saveButton.disabled = true;
        saveButton.textContent = "Saving...";

        try {
            const users = getUsers();

            const userIndex = users.findIndex(
                item => item.id === user.id
            );

            if (userIndex === -1) {
                showProfileMessage("Account not found. Please log in again.");
                return;
            }

            // Update user information
            users[userIndex].fullName = newName;
            users[userIndex].institution = newInstitution;

            // Save updated information
            saveUsers(users);

            // Update the local user object
            user.fullName = newName;
            user.institution = newInstitution;

            // Refresh displayed information
            loadProfile();

            showProfileMessage(
                "Your profile has been updated successfully!",
                true
            );

        } catch (error) {
            showProfileMessage(
                "Unable to save your changes. Please try again."
            );

        } finally {
            saveButton.disabled = false;
            saveButton.textContent = "Save Changes";
        }
    });

    // Logout
    logoutButton.addEventListener("click", () => {
        const confirmed = confirm(
            "Are you sure you want to log out?"
        );

        if (confirmed) {
            logout();
        }
    });

    // Initial profile loading
    loadProfile();

});
