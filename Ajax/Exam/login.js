const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const apiError = document.getElementById("apiError");

const FIXED_PASSWORD = "Satva1213#";

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

emailInput.addEventListener("input", () => {
    if (!validateEmail(emailInput.value)) {
        emailError.textContent = "Please enter a valid email address";
        emailInput.classList.add("is-invalid");
    } else {
        emailError.textContent = "";
        emailInput.classList.remove("is-invalid");
    }
});

passwordInput.addEventListener("input", () => {
    if (passwordInput.value !== FIXED_PASSWORD) {
      passwordError.textContent = "Password is invalid";
      passwordInput.classList.add("is-invalid");
    } else {
      passwordError.textContent = "";
      passwordInput.classList.remove("is-invalid");
    }
});

// Form submit
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    apiError.textContent = "";

    let valid = true;

    // Email check
    if (!validateEmail(emailInput.value)) {
      emailError.textContent = "Please enter a valid email address";
      emailInput.classList.add("is-invalid");
      valid = false;
    }

    // Password check
    if (passwordInput.value !== FIXED_PASSWORD) {
      passwordError.textContent = "Password must be Satva1213#";
      passwordInput.classList.add("is-invalid");
      valid = false;
    }

    if (!valid) return;

    // API call
    try {
      const response = await fetch(
        "http://trainingsampleapi.satva.solutions/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            Email: emailInput.value,
            Password: passwordInput.value
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

    //   console.log("API Response:", data);
      // Store token
      localStorage.setItem("token", data.token);

      alert("Login Successful!");

      // Redirect later (next requirement)
       window.location.href = "dashboard.html";

    } catch (error) {
      apiError.textContent = error.message;
    }
  });