'use strict';

var fs = require('fs');
var async = require('async');
var parse = require('csv-parse');
var emailFinder = require('./email-finder');

// var file = fs.createWriteStream(__dirname + '/../final.json');
//
// file.write('[' + '\n');
//
// file.on('error', function(err) {
//   console.log('failed');
//   console.log(err);
// });
//
// file.on('end', function() {
//
// })

// create a queue object with concurrency 2
var q = async.queue(function(task, callback) {
  console.log(task.name);

    emailFinder(task)
    .then(function (email) {
      task.email = email;

      var data = JSON.stringify(task);
      file.write(data + ',' + '\n', 'utf-8');

      callback();
    })
    .catch(function (err) {
      callback();
    })
}, 1);

// assign a callback
q.drain = function() {
    console.log('all items have been processed');

    q.kill();

    file.write('\n' + ']');
    file.end();
};

q.error = function(err) {
  console.log('the queue errored');
  console.log(err);
}

function start(file, cb) {

  fs.readFile(file, function(err, data) {
    if (err) {
      return cb(err);
    }

    parse(data, {columns: true}, function(err, output) {
      if (err) {
        return cb(err);
      }

      for (var i = 0; i < output.length; i++) {

        let record = {
          domain: output[i].domain,
          name: output[i].first_name + ' ' + output[i].last_name
        };

        if (record.domain && record.name) {
          q.push(record, function(err) {
            if (err) {
              console.log(err);
            }
          });
        }
      }
    });
  })
}

process.on('error', function (err) {
  console.log('global error');
})

process.on('uncaughtException', function(err) {
  console.log('global error');
});
