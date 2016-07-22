var express = require('express');
var path = require('path');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

// configure environemnt
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// use middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



// define routes

pg.connect(process.env.DATABASE_URL, function(err, client) {
    if (err) {
        console.log('Some error occured');
    } else {
        var attachedDb = function(req, res, next) {
            req.db = client;
            next();
        };

        app.all('/admin*', attachedDb, function(req, res, next) {
			Admin.run(req, res, next);
		});

        // start the server
        var port = process.env.PORT || 1337;
        app.listen(port, function () {
            console.log('listen on port ' + port);
        });
    }
});


var router = require('./new');
app.use(router);




