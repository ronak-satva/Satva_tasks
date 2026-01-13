const form = document.getElementById("registerForm1");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

confirmPassword.addEventListener("input", () => {
    if (confirmPassword.value === password.value) {
        confirmPassword.classList.remove("is-invalid");
        confirmPassword.classList.add("is-valid");
    } else {
        confirmPassword.classList.remove("is-valid");
        confirmPassword.classList.add("is-invalid");
    }
});

form.addEventListener("submit", function (event) {
    if (!form.checkValidity() || password.value !== confirmPassword.value) {
        event.preventDefault();
        event.stopPropagation();
        confirmPassword.classList.add("is-invalid");
    }
    form.classList.add("was-validated");
});