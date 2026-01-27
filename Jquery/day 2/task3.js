
    $(document).ready(function(){
    
      /* ===== Plugins ===== */
    //   $('#disease').multiselect({ buttonWidth: '100%' });
    
      $('#dateRange').daterangepicker({
        minDate: moment(),
        autoUpdateInput: false, // prevent empty default value
        locale: {
            format: 'DD/MM/YYYY'
        }

    });
    // Set selected date in input
    $('#dateRange').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(
            picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY')
        ).valid(); // trigger validation
    });
    
    
    // Clear input on cancel
    $('#dateRange').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('').valid();
    });


      const cities = ["Mumbai","Pune","Delhi","Bangalore","Chennai","Ahmedabad"];
      $("#city").autocomplete({ source: cities });
    
      $("#mobile").on("input", function(){
        this.value = this.value.replace(/[^0-9]/g,'');
      });
    
      /* ===== jQuery Validation ===== */
      $("#bookForm").validate({
        ignore: [],
        onkeyup: true,
        onfocusout: function(element) {
          $(element).valid(); // validate on blur
        },
    
        rules: {
          patientName: {
            required: true,
            minlength: 3
          },
          mobile: {
            required: true,
            digits: true,
            minlength: 10,
            maxlength: 10
          },
          city: {
            required: true
          },
          dateRange: {
            required: true
          },
          staffCount: {
            required: true,
            digits: true,
            min: 1
          },
          address: {
            required: true,
            minlength: 10
          }
        },
    
        messages: {
          patientName: {
            required: "Patient name is required",
            minlength: "Patient name must be at least 3 characters"
          },
          mobile: {
            required: "Mobile number is required",
            digits: "Only numbers are allowed",
            minlength: "Mobile number must be 10 digits",
            maxlength: "Mobile number must be 10 digits"
          },
          city: {
            required: "City is required"
          },
          dateRange: {
            required: "Please select service date"
          },
          staffCount: {
            required: "Number of staff is required",
            digits: "Only numbers allowed",
            min: "At least 1 staff is required"
          },
          address: {
            required: "Address is required",
            minlength: "Address must be at least 10 characters"
          }
        },
    
        errorElement: "div",
        errorClass: "error",
    
        errorPlacement: function(error, element) {
          if (element.attr("id") === "disease") {
            error.insertAfter(element.next(".btn-group")); // multiselect fix
          } else {
            error.insertAfter(element);
          }
        },
    
        highlight: function(element) {
          $(element).addClass("is-invalid");
        },
    
        unhighlight: function(element) {
          $(element).removeClass("is-invalid");
        },
    
        submitHandler: function(form) {

let bookingData = {
  patientName: $("#patientName").val(),
  mobile: $("#mobile").val(),
  disease: $("#disease").val(),
  city: $("#city").val(),
  serviceDate: $("#dateRange").val(),
  staffCount: $("#staffCount").val(),
  address: $("textarea[name='address']").val(),
  createdAt: new Date().toISOString()
};

// Get existing data
let existingData = localStorage.getItem("bookings");
existingData = existingData ? JSON.parse(existingData) : [];

// Push new record
existingData.push(bookingData);

// Save back to localStorage
localStorage.setItem("bookings", JSON.stringify(existingData));

Swal.fire({
  icon: 'success',
  title: 'Booking Saved',
  text: 'Nursing staff booking stored successfully'
});


form.reset();
$('#disease').multiselect('refresh');

return false;
}
      });
    
      /* Multiselect live validation */
      $('#disease').on('change', function () {
        $(this).valid();
      });
    
    });