
var selectedEvent = null;
document.addEventListener('DOMContentLoaded', function () {


    var calendarEl = document.getElementById('calendar');
    var selectedStart, selectedEnd;

    var bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));


    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }, selectable: true,
        select: function (info) {
            selectedStart = info.start;
            selectedEnd = info.end;
            selectedEvent = null; // new booking

            // Clear inputs
            document.getElementById('patientName').value = '';
            document.getElementById('mobileNumber').value = '';

            // HIDE delete button
            document.getElementById('deleteBooking').classList.add('d-none');

            bookingModal.show();
        },
        eventClick: function (info) {
            selectedEvent = info.event;
    
            // Extract name & mobile from title
            var text = info.event.title;
            var parts = text.match(/(.*)\s\((.*)\)/);
    
            document.getElementById('patientName').value = parts[1];
            document.getElementById('mobileNumber').value = parts[2];

            // Show delete button 
            document.getElementById('deleteBooking').classList.remove('d-none');

            bookingModal.show();
        }
    });
    calendar.render();

    // Delete event logic
    document.getElementById('deleteBooking').addEventListener('click', function () {
        if (selectedEvent) {
            selectedEvent.remove();
            bookingModal.hide();
        }
    });

     // Inputs & error elements
    var nameInput = document.getElementById('patientName');
    var mobileInput = document.getElementById('mobileNumber');

    var nameError = document.getElementById('nameError');
    var mobileError = document.getElementById('mobileError');
    
     // Live Name Validation
    nameInput.addEventListener('input', function () {
        var namePattern = /^[A-Za-z\s]+$/;

        // Remove invalid characters while typing
        this.value = this.value.replace(/[^A-Za-z\s]/g, '');

        if (this.value.trim() === '' || !namePattern.test(this.value)) {
            nameError.classList.remove('d-none');
        } else {
            nameError.classList.add('d-none');
        }
    });

    //Live Mobile validation

    mobileInput.addEventListener('input', function () {

        // Allow only digits & max 10 characters
        this.value = this.value.replace(/\D/g, '').slice(0, 10);

        var mobilePattern = /^[0-9]{10}$/;

        if (!mobilePattern.test(this.value)) {
            mobileError.classList.remove('d-none');
        } else {
            mobileError.classList.add('d-none');
        }
    });
    // Confirm Booking Button
    document.getElementById('confirmBooking').addEventListener('click', function () {

        var name = nameInput.value.trim();
        var mobile = mobileInput.value.trim();
    
        if (name === "" || mobile === "") {
            alert("All fields are required");
            return;
        }
    
        if (selectedEvent) {
            // EDIT EVENT
            selectedEvent.setProp('title', name + ' (' + mobile + ')');
        } else {
            // ADD NEW EVENT
            calendar.addEvent({
                title: name + ' (' + mobile + ')',
                start: selectedStart,
                end: selectedEnd
            });
        }
    
        bookingModal.hide();
    });
    



});

