$('#sendMessageButton').on('click',function(){
      console.log('function trigger');
      var name = $('#name').val();
      var email = $('#email').val();
      var phone = $('#phone').val();
      var message = $('#message').val();
      $.ajax({
        type: "POST",
        url: "/sendMessage",
        data: {
          name : name,
          email : email,
          phone : phone,
          message : message
//          position : loc
        },
        success: function(response){

          /*new google.maps.Map(document.getElementById('geolocalizationResponse'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
          });*/
          //$('#geolocalizationResponse').html('test');
          $('#hiddenModal').trigger('click');
        }
      });
  });
