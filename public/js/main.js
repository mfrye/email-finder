

// On result
function onResult() {

}

// On submit
function onSubmit(e) {
  var loadingCover = $('.loading-cover');
  var result = $('#result');

  e.preventDefault();

  // Get data from form
  var data = $(e.target).serializeArray().reduce(function(obj, item) {
    obj[item.name] = item.value;
    return obj;
  }, {});

  // Show loading screen
  loadingCover.addClass('show');

  // Clear old result
  result.html('');

  $('#result').html

  $.ajax({
    url: "/find",
    method: "POST",
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
  })
  .done(function(data) {
    console.log(data);

    // Hide loading screen
    loadingCover.removeClass('show');

    // Set result
    $('#result').html('Success! The email is: ' + data.email);
  })
  .fail(function (err) {

    // Hide loading screen
    loadingCover.removeClass('show');

    // Set result
    $('#result').html('There was a problem finding the email.');
  });

  return false;
}

var form = document.getElementById('email-form');

form.addEventListener('submit', onSubmit);
