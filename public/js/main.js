
/*
 * Validate the form
 *
 * - Check that fields aren't empty, if so add invalid class
 */
function validate(data) {
  var valid = true;

  for (var key in data) {
    var input = $("input[name='" + key + "']");

    if (!data[key]) {
      valid = false;
      input.addClass('invalid');
    }
    else {
      input.removeClass('invalid');
    }
  }

  return valid;
}

/*
 * Build data
 *
 * - Serialize form and build object
 */
function buildData(form) {
  return $(form).serializeArray().reduce(function(obj, item) {
    obj[item.name] = item.value.trim();

    if (obj[item.name]) {
      obj[item.name] = item.value.toLowerCase();
    }

    return obj;
  }, {});
}

/*
 * On submit handler
 */
function onSubmit(e) {
  var loadingCover = $('.loading-cover');
  var result = $('#result');

  e.preventDefault();

  // Get data from form
  var data = buildData(e.target);

  if (!validate(data)) {
    return
  }

  // Show loading screen
  loadingCover.addClass('show');

  // Clear old result
  result.html('');

  $('#result').html;

  $.ajax({
    url: "/find",
    method: "POST",
    data: JSON.stringify(data),
    timeout: 20000,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
  })
  .done(function(data) {

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

/*
 * Initialize
 */
function init() {
  var form = document.getElementById('email-form');

  form.addEventListener('submit', onSubmit);

  $(".button-collapse").sideNav();
}

init();
