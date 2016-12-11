
var swig  = require('swig');
var async = require('async');
var template = swig.compileFile(__dirname + '/emails.txt');
var emailExistence = require('email-existence');

function processParams(program){

  if (!program.name) {
    console.log('Please provide the full name of the person surrounded by quotation marks.');
    return Promise.reject();
  }
  else if (!program.domain) {
    console.log('Please provide the company\'s domain');
    return Promise.reject();
  }
  else {

    var nameArr = program.name.split(" ");
    if (nameArr.length != 2 || nameArr[0].length == 0 || nameArr[1].length == 0) {
      console.error('You must provide a full name %s', program.name)
      return Promise.reject();
    }
    else{
      var firstname = nameArr[0].toLowerCase();
      var lastname = nameArr[1].toLowerCase();
      return createEmailsList(program.domain, firstname, lastname);
    }
  }
}

function createEmailsList(domain, firstname, lastname){
  var fi = firstname.charAt(0);
  var li = lastname.charAt(0);

  var output = template({
      li : li,
      fi : fi,
      fn : firstname,
      ln : lastname,
      domain : domain
  });

  var emailsArr = output.split('\n');

  return new Promise(function(resolve, reject) {

    var q = async.queue(function (email, callback) {

      console.log('Testing %s...', email)

       emailExistence.check(email, function(err, res) {

        if (err) {
          return callback();
        }

         if (res) {
           console.log("%s is a valid email address", email);

          // Kill the queue
          q.kill();
          return resolve(email);
         }

        callback();
      });

    }, 2);

    emailsArr.forEach(function(email){
      q.push(email, function (err) {});
    });

    q.drain = function() {
      console.log('Not found: ', JSON.stringify(domain, firstname, lastname));
      reject();
    }
  });
}

module.exports = processParams;
