var expect = require('chai').expect;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var message = require("../controllers/message")(io);

describe("message", () => {
	it("should be able to create a room", next => {
		var child = new Room();
		expect(child.run).to.not.be.undefined;
		expect(child.name).to.not.be.undefined;
		expect(child.name).to.equal("my child controller");
		next();
	});
    
});