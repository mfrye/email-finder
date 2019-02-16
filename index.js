var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var debug = require('debug')('index');

var emailFinder = require('./lib/email-finder');

var app = express();

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

var rootDir = path.resolve(__dirname);

app.set('port', (process.env.PORT || 5000));

// Configure jade as template engine
app.set('views', rootDir + '/views');
app.set('view engine', 'ejs');
app.set("view options", {layout: false});

// Parse the body
// Warning: http://andrewkelley.me/post/do-not-use-bodyparser-with-express-js.html
// parse application/json
app.use(bodyParser.json())

// Serve static content from "public" directory
app.use(express.static(rootDir + '/public'));


app.get('/', function(req, res){
  res.render('index', {
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID || ''
  });
});

app.post('/find', function(req, res) {

  var data = {
    name: req.body.first_name.trim() + ' ' + req.body.last_name.trim(),
    domain: req.body.domain
  };

  emailFinder(data)
  .then(function (email) {
    res.send({email: email});
  })
  .catch(function (err) {
    res.status(500).send(err);
  })
});

  // All set, start listening!
app.listen(app.get('port'), function() {
  console.log(`Server running at http://localhost:${app.get('port')}`);
});
