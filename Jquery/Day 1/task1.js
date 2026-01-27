$(document).ready(function(){
const stateCityMap = {
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara","Anand","Rajkot","Gandhigram"],
    Rajasthan: ["Jaipur", "Udaipur", "Jodhpur"],
    Delhi: ["New Delhi", "Dwarka"],
    Karnataka: ["Bangalore", "Mysore"]
  };


// State Select
$.each(stateCityMap, function (state) {
    $("#state").append(`<option value="${state}">${state}</option>`);
});


// City select based on state
$("#state").change(function () {
    const state = $(this).val();
    $("#city").prop("disabled", !state);
    $("#city").html('<option value="">Choose City...</option>');
  
    if (state) {
      $.each(stateCityMap[state], function (_, city) {
        $("#city").append(`<option value="${city}">${city}</option>`);
      });
    }
  });

// Datepicker
  $('input[name="duration"]').daterangepicker({
    // autoUpdateInput: true,
    locale: { format: "DD/MM/YYYY" },
    drops: "up"
  });



// Validation
$.validator.addMethod("mobileRegex", v => /^[1-9]\d{9}$/.test(v));
$.validator.addMethod("zipRegex", v => /^\d{6}$/.test(v));
$.validator.addMethod("durationRegex", function (value) {
    return /^\d{2}\/\d{2}\/\d{4}\s-\s\d{2}\/\d{2}\/\d{4}$/.test(value);
  });
$.validator.addMethod("lettersOnly", function(value, element) {
    return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
}, "Only letters are allowed");

$("#studentForm").validate({
    errorClass: "is-invalid",
    validClass: "is-valid",
    errorElement: "div",
    errorPlacement: function (error, element) {
      error.addClass("invalid-feedback");
      error.insertAfter(element);
    },
    onkeyup: function (element) {
      $(element).valid();
    },
    rules: {
      name: 
      { required: true, minlength: 3, lettersOnly: true },
      collegeName: { required: true, lettersOnly: true },
      state: { required: true },
     city: { required: true },
     email: { required: true, email: true },
     branchName: { required: true },

      mobile: {
        required: true,
        digits: true,
        minlength: 10,
        maxlength: 10
      },
      zip: {
        required: true,
        digits: true,
        minlength: 6,
        maxlength: 6
      },
      cgpa: {
        required: true,
        number: true,
        min: 0,
        max: 10
      }
    },
    messages: {
      mobile: {
        digits: "Numbers only",
        minlength: "Mobile number must be 10 digits",
        maxlength: "Mobile number must be 10 digits"
      },
      zip: {
        digits: "Numbers only",
        minlength: "Zip code must be 6 digits",
        maxlength: "Zip code must be 6 digits"
      },
      cgpa: {
        number: "Numbers only"
      }
    }
  });
  

//   Get form data

function getFormData() {
    return Object.fromEntries(new FormData(document.getElementById("studentForm")));
  }

//   Add new 
  $("#addNew").click(function () {
    if ($("#studentForm").valid()) {
      let data = JSON.parse(localStorage.getItem("studentData")) || [];
      data.push(getFormData());
      localStorage.setItem("studentData", JSON.stringify(data));
      alert("Data Added Successfully");
      $("#studentForm")[0].reset();
      $("#city").prop("disabled", true);
      $(".is-valid, .is-invalid").removeClass("is-valid is-invalid");
    }
  });
  
  /* EXPORT */
  $("#exportData").click(function () {
    let data = JSON.parse(localStorage.getItem("studentData")) || [];
    let rows = "";
    data.forEach(d => {
      rows += `<tr>
        <td>${d.name}</td>
        <td>${d.mobile}</td>
        <td>${d.email}</td>
        <td>${d.collegeName}</td>
        <td>${d.cgpa}</td>
        <td>${d.branchName}</td>
        <td>${d.state}</td>
        <td>${d.city}</td>
        <td>${d.zip}</td>
        <td>${d.duration}</td>
      </tr>`;
    });
    $("#dataTable").html(rows);
  });
  
  /* CLEAR STORAGE */
  $("#clearStorage").click(function () {
    localStorage.removeItem("studentData");
    $("#dataTable").empty();
    alert("Storage Cleared");
  });
});
