document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggle-password");
    const password = document.getElementById("password");
    const confirm = document.getElementById("confirm-password");
    const email = document.getElementById("email");
    const form = document.getElementById("signup-form");
    const errorBox = document.getElementById("error-message");

    // Toggle password visibility
    toggle.addEventListener("change", function () {
        const type = this.checked ? "text" : "password";
        password.type = type;
        confirm.type = type;
    });

    // Email format check using regex
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Form validation
    form.addEventListener("submit", function (e) {
        let hasError = false;
        errorBox.textContent = "";
        errorBox.style.display = "none";
        [email, password, confirm].forEach(input => input.classList.remove("error"));

        const pwd = password.value;
        const confirmPwd = confirm.value;

        if (!isValidEmail(email.value)) {
            hasError = true;
            email.classList.add("error");
            errorBox.textContent = "Please enter a valid email address.";
        } else if (pwd.length < 4 || pwd.length > 40) {
            hasError = true;
            password.classList.add("error");
            errorBox.textContent = "Password must be between 4 and 40 characters.";
        } else if (pwd !== confirmPwd) {
            hasError = true;
            password.classList.add("error");
            confirm.classList.add("error");
            errorBox.textContent = "Passwords do not match.";
        }

        if (hasError) {
            e.preventDefault();
            errorBox.style.display = "block";
        }
    });
});
