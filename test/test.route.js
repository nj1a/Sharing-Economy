var chai = require('chai');
var expect = chai.expect;
var request = require('superagent');

describe("route", () => {
	it("should access the homepage", done => {
		request.get('https://wander-land.herokuapp.com').end((err, res) => {
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.error).to.equal(false);
			done();
		});
	});

	it("should see the login success page", done => {
		request.get('https://wander-land.herokuapp.com/login_success').end((err, res) => {
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.error).to.equal(false);
			done();
		});
	});

	it("should see the message page", done => {
		request.get('https://wander-land.herokuapp.com/message').end((err, res) => {
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.text).to.equal('You need to sign in first');
			expect(res.error).to.equal(false);
			done();
		});
	});

	it("should see the woulrd map", done => {
		request.get('https://wander-land.herokuapp.com/world_map').end((err, res) => {
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.error).to.equal(false);
			done();
		});
	});

	it("should see the create post page", done => {
		request.get('https://wander-land.herokuapp.com/create_post').end((err, res) => {
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.error).to.equal(false);
			done();
		});
	});

	it("should get country by key", done => {
		// try to get Greenland
		request.get('https://wander-land.herokuapp.com/get_country?key=GL').end((err, res) => {
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.error).to.equal(false);
			done();
		});
	});

	it("should show no matching by asking for a wrong country code", done => {
		// try to get a random code
		request.get('https://wander-land.herokuapp.com/get_country?key=GLA').end((err, res) => {
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.error).to.equal(false);
			expect(res.text).to.equal('No matching result');
			done();
		});
	});

	it("should get city by key", done => {
		// try to get New York
		request.get('https://wander-land.herokuapp.com/get_city?key=1').end((err, res) => {
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.error).to.equal(false);
			done();
		});
	});
});