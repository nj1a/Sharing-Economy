var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var Room = require('./room');  
var uuid = require('node-uuid');





var Admin = require('./controllers/admin');
// configure environemnt
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// use middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get('/chat', function(req, res){
  res.sendfile('./public/chat.html');
});

io.on('connection', function(socket){
    
    socket.on('little_newbie', function(username) {
        socket.username = username;
        console.log('%s connected', username);
    });
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
        console.log(socket.username + ' is speaking to me! They\'re saying: ' + msg);
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

// define routes

pg.connect(process.env.DATABASE_URL, function(err, client) {
    /*if (err) {
        console.log(err);
        console.log('Some error occured');
    } else {*/
        var attachedDb = function(req, res, next) {
            req.db = client;
            next();
        };

        app.all('/admin*', attachedDb, function(req, res, next) {
			Admin.run(req, res, next);
		});

        // start the server
        var port = process.env.PORT || 1337;
        server.listen(port, function () {
            console.log('listen on port ' + port);
        });
  // }
});


io.set("log level", 1); 
var people = {};  
var rooms = {};  
var clients = []; 

var router = require('./new');
app.use(router);




