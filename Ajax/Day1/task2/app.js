$(document).ready( function(){

    // Load Default

    $('.nav-link').click(function (e) {
        e.preventDefault(); // prevent page refresh
    
        const page = $(this).data('page');
    
        $('.nav-link').removeClass('active');
    
        $(this).addClass('active');
    
        loadpage(page);
      });

    function loadpage(page){
        $('#loader').removeClass('d-none');

        setTimeout(function () {

            $.ajax({
              url: page,
              method: 'GET',
              success: function (response) {
                $('#content').html(response);
              },
              error: function () {
                $('#content').html('<h4>Failed to load page</h4>');
              },
              complete: function () {
                $('#loader').addClass('d-none');
              }
            });
      
          }, 800); // ⏱ loader visible time (ms)
        }
})