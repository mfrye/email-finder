
// Get sesssion data from localStorage
var LOCAL_STORAGE_KEY = 'bp_session';
var sessionData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
sessionData = sessionData ? JSON.parse(sessionData) : {submissions: 0, email: false};

/*
 * Check session
 *
 * - Only allow 3 email checks before asking for email
 */
function checkSession() {
  setTimeout(function () {
    if (!sessionData.email && sessionData.submissions >= 3) {
      $('#modal1').modal('open');
    }
  }, 2000);

}

/*
 * On email modal submit handler
 */
function onEmailSubmit(e) {

  e.preventDefault();

  // Get data from form
  var data = buildData(e.target);

  if (!validate(data)) {
    return
  }

  // Disable form
  $('#email-capture input').attr('disabled', true);
  $('#email-capture button').attr('disabled', true);

  // $('#result').html;
  data.type = 'Email Finder';

  $.ajax({
    url: "https://7umdo22ge3.execute-api.us-west-2.amazonaws.com/dev/email",
    method: "POST",
    data: JSON.stringify(data),
    timeout: 20000,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
  })
  .done(function(data) {

    $('#email-capture input').attr('disabled', false);
    $('#email-capture button').attr('disabled', false);

    // Set that email has been submitted
    sessionData.email = true;

    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessionData));

    $('#modal1').modal('close');
  })
  .fail(function (err) {

    $('#email-capture input').attr('disabled', false);
    $('#email-capture button').attr('disabled', false);
  });

  return false;
}

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

    // Count the number of submissions
    sessionData.submissions++;

    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessionData));

    checkSession();
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

  $('#email-form').on('submit', onSubmit);
  $('#email-capture').on('submit', onEmailSubmit);

  $(".button-collapse").sideNav();

  $('.modal').modal({
      dismissible: false, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
      starting_top: '4%', // Starting top style attribute
      ending_top: '10%', // Ending top style attribute
    }
  );

  checkSession();
}

$(document).ready(init);
