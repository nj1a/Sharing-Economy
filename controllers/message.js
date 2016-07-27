'use strict'; 
var Room = require('./room');  
var uuid = require('node-uuid');
var _ = require('underscore')._;

var people = {}, rooms= {};
var peopleCount = 0, roomCount = 0;
var sockets = [];
var msgHistory = {};


function roomRemoved(io, s, room) {
	io.sockets.to(s.room).emit('update', 'The room is removed.');
	var socketids = [];
	for (var i=0; i < sockets.length; i++) {
		socketids.push(sockets[i].id);
		if (_.contains((socketids)), room.people) {
			sockets[i].leave(room.name);
		}
	}

	if(_.contains((room.people)), s.id) {
		for (var j=0; j<room.people.length; j++) {
			people[room.people[j]].inroom = null;
		}
	}

	//remove people from the room
	room.people = _.without(room.people, s.id);

 	// delete the message history
	delete msgHistory[room.name];

	// update room count
	delete rooms[people[s.id].owns]; 
	roomCount = _.size(rooms);
	io.emit('updateRoomCount', {rooms: rooms, count: roomCount});
}

function userDisconnected(io, s) {
	// update people count
	delete people[s.id];
	peopleCount = _.size(people);
	io.emit('updatePeopleCount', {people: people, count: peopleCount});
	
	// remove user from sockets
	var o = _.findWhere(sockets, {'id': s.id});
	sockets = _.without(sockets, o);
}

function userLeft(io, s, room) {
	if (_.contains((room.people), s.id)) {
		var personIndex = room.people.indexOf(s.id);
		room.people.splice(personIndex, 1);
		people[s.id].inroom = null;
		io.emit('update', people[s.id].name + ' has left the room.');
		s.leave(room.name);
	}
}


function purge(io, s, action) {
	/*
	The action will determine how we deal with the room/user removal.
	These are the following scenarios:
	if the user is the owner and (s)he:
		1) disconnects (i.e. leaves the whole server)
			- advise users
		 	- delete user from people object
			- delete room from rooms object
			- delete message history
			- remove all users from room that is owned by disconnecting user
		2) removes the room
			- same as above except except not removing user from the people object
		3) leaves the room
			- same as above
	if the user is not an owner and (s)he's in a room:
		1) disconnects
			- delete user from people object
			- remove user from room.people object
		2) removes the room
			- produce error message (only owners can remove rooms)
		3) leaves the room
			- same as point 1 except not removing user from the people object
	if the user is not an owner and not in a room:
		1) disconnects
			- same as above except not removing user from room.people object
		2) removes the room
			- produce error message (only owners can remove rooms)
		3) leaves the room
			- n/a
	*/
	if (people[s.id].inroom) { // user is in a room
		var room = rooms[people[s.id].inroom]; // find which room user is in.
		if (s.id === room.owner) { //user is the owner
			if (action === 'disconnect') {
				roomRemoved(io, s, room);
				userDisconnected(io, s);

			} else if (action === 'removeRoom') { //room owner removes room
				roomRemoved(io, s, room);
				people[s.id].owns = null;

			} else if (action === 'leaveRoom') { //room owner leaves room
				roomRemoved(io, s, room);
				people[s.id].owns = null;
			}
		} else {//user in room but does not own room
			if (action === 'disconnect') {
				userLeft(io, s, room);
				userDisconnected(io, s);
			} else if (action === 'removeRoom') {
				s.emit('update', 'Only the owner can remove a room.');
			} else if (action === 'leaveRoom') {
				userLeft(io, s, room);
			}
		}	
	} else {
		//The user isn't in a room, but maybe he just disconnected, handle the scenario:
		if (action === 'disconnect') {
			io.emit('update', people[s.id].name + ' has disconnected from the server.');
			userDisconnected(io, s);
		}		
	}
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('start', (name, device) => {
            var ownerRoomID = null;
            var inRoomID = null;

            var exists = _.find(people, (person) => {
                return person.name.toLowerCase() === name.toLowerCase();
            });

            if (exists) {
                socket.emit('nameExists', 'The username already exists. Please pick another one.');
            } else {
                people[socket.id] = {
                    'name' : name, 
                    'owns' : ownerRoomID, 
                    'inroom': inRoomID, 
                    'device': device
                };

                // connection msg
                socket.emit('update', 'You have connected to the server.');
                io.emit('update', people[socket.id].name + ' is online.');

                // update people and rooms
                peopleCount = _.size(people);
                roomCount = _.size(rooms);
                socket.emit('updateRoomCount', {
					rooms: rooms, 
					count: roomCount
				});
                io.emit('updatePeopleCount', {
					people: people, 
					count: peopleCount
				});
                
                // record socket
                sockets.push(socket);
            }
        });

        socket.on('typing', (bool) => {
            if (typeof people[socket.id] !== 'undefined') {
                io.sockets.to(socket.room).emit('isTyping', {
					isTyping: bool, 
					name: people[socket.id].name
				});
            }
        });
        
        socket.on('send', (msgTime, msg) => {
            if (people[socket.id].inroom) {
				io.sockets.to(socket.room).emit('message', msgTime, people[socket.id], msg);
				socket.emit('isTyping', false);
				if (_.size(msgHistory[socket.room]) > 50) {
					msgHistory[socket.room].splice(0, 1); // remove one ele from idx 0
				} else {
					msgHistory[socket.room].push(people[socket.id].name + ': ' + msg); // cache this msg
				}
            } else {
            	socket.emit('update', 'Please join a room first.');
            }
        });
        
        socket.on('disconnect', () => {
            if (typeof people[socket.id] !== 'undefined') { // handles the refresh of the name screen
                purge(io, socket, 'disconnect');
            }
        });

        //Room functions
        socket.on('checkRoomName', (name, func) => {
            var exists = _.find(rooms, (room) => {
                return room.name === name;
            });
			// send back the result
            func({result: exists});
        });

		socket.on('createRoom', (roomName) => {
            if (people[socket.id].inroom) {
                socket.emit('update', 'Please leave your current room first.');
            } else if (!people[socket.id].owns) {
				// create a room
                var id = uuid.v4();
                var room = new Room(roomName, id, socket.id);
                rooms[id] = room;

				// update room count 
                var roomCount = _.size(rooms);
                io.emit('updateRoomCount', {rooms: rooms, count: roomCount});

                // initialize the room and add the owner
                socket.room = roomName;
                socket.join(socket.room);
                people[socket.id].owns = id;
                people[socket.id].inroom = id;
                room.add(socket.id);

				// broadcase the room
                socket.emit('update', 'Welcome to ' + room.name + '.');
                socket.emit('sendRoomID', {id: id});
                msgHistory[socket.room] = [];
            } else {
                socket.emit('update', 'You cannot have more than one room.');
            }
        });

        socket.on('removeRoom', (roomId) => {
            var room = rooms[roomId];
            if (socket.id === room.owner) {
                purge(io, socket, 'removeRoom');
            } else {
				socket.emit('update', 'You are not the owner.');
            }
        });

        socket.on('joinRoom', (roomId) => {
            if (typeof people[socket.id] !== 'undefined') {
                var room = rooms[roomId];
                if (socket.id === room.owner) {
                    socket.emit('update', 'You are already in the room.');
                } else {
                    if (_.contains((room.people), socket.id)) {
                        socket.emit('update', 'You are already in this room.');
                    } else {
                        if (people[socket.id].inroom !== null) {
                                socket.emit('update', 'You are already in the room (' + rooms[people[socket.id].inroom].name + ').');
						} else {
							// add this user to the room
							var user = people[socket.id];
							user.inroom = roomId;
							room.add(socket.id);
							socket.room = room.name;
							socket.join(socket.room);

							// broadcast
							io.sockets.to(socket.room).emit('update', user.name + ' has joined room ' + room.name + '.');
							socket.emit('update', 'Welcome to ' + room.name + '.');
							socket.emit('sendRoomID', {id: roomId});

							// show past msgs
							var keys = _.keys(msgHistory);
							if (_.contains(keys, socket.room)) {
								socket.emit('history', msgHistory[socket.room]);
							}
                        }
                    }
                }
            } else {
                socket.emit('update', 'Please enter a valid name first.');
            }
        });

        socket.on('leaveRoom', (roomId) => {
            var room = rooms[roomId];
            if (room) {
                purge(io, socket, 'leaveRoom');
            }
        });
    });
};