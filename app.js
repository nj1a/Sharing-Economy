var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);



// configure environemnt
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// use middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname + 'js')));
app.use('/css', express.static(path.join(__dirname + 'css')));
app.use('/img', express.static(path.join(__dirname + 'img')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// message


// define routes



// start the server
var port = process.env.PORT || 1337;
server.listen(port, function () {
	console.log('listen on port ' + port);
});


var router = require('./new');
app.use(router);

require('./controllers/message')(io);




