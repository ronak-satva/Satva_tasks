const form = document.getElementById("employeeForm");
const profilePic = document.getElementById("profilePic");


profilePic.addEventListener("change", function () {
    const file = profilePic.files[0];

    if (file && file.type.startsWith("image/")) {
        profilePic.setCustomValidity("");
    } else {
        profilePic.setCustomValidity("Invalid image");
    }
});

form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    alert("Form submitted successfully!");
    form.reset();
    form.classList.remove("was-validated");
});

