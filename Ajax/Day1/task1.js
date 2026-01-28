$(document).ready(function ()
{
    // Load Countries
$.ajax({
    url : "https://countriesnow.space/api/v0.1/countries/",
    method : "GET",
    success : function(response){
        $.each(response.data, function (i, country){
            $("#country").append(
                `<option value="${country.country}">${country.country}</option>`
            );
        });
    }
});

// Load States
$("#country").change(function () {
    $("#state").html(`<option value="">Select State</option>`);
    $("#city").html(`<option value="">Select City</option>`);

    $.ajax({
      url: "https://countriesnow.space/api/v0.1/countries/states",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        country: $(this).val()
      }),
      success: function (response) {
        $.each(response.data.states, function (i, state) {
          $("#state").append(
            `<option value="${state.name}">${state.name}</option>`
          );
        });
      }
    });
  });

// Load City
$("#state").change(function () {
    $("#city").html(`<option value="">Select City</option>`);

    $.ajax({
      url: "https://countriesnow.space/api/v0.1/countries/state/cities",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        country: $("#country").val(),
        state: $(this).val()
      }),
      success: function (response) {
        $.each(response.data, function (i, city) {
          $("#city").append(
            `<option value="${city}">${city}</option>`
          );
        });
      }
    });
  });

});