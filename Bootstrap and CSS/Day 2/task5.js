const form = document.getElementById("appointmentForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    alert("Appointment Scheduled Successfully!");
    form.reset();
    form.classList.remove("was-validated");
});
