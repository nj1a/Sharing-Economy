var express = require('express');
var path = require('path');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

// configure app
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// use middleware
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



// define routes
var router = require('./new');
app.use(router);


// start the server
var port = process.env.PORT || 1337;
app.listen(port, function () {
    console.log('listen on port ' + port);
});