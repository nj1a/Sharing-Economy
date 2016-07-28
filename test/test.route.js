var chai = require('chai');
var expect = chai.expect;
var request = require('superagent');

describe("route", () => {
	it("should access the homepage", done => {
		request.get('http://localhost:1337').end((err, res) => {
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.error).to.equal(false);
			done();
		});
	});

	it("should see the login success page", done => {
		request.get('http://localhost:1337/login_success').end((err, res) => {
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.error).to.equal(false);
			done();
		});
	});

	it("should see the message page", done => {
		request.get('http://localhost:1337/message').end((err, res) => {
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.text).to.equal('You need to sign in first');
			expect(res.error).to.equal(false);
			done();
		});
	});

	it("should see the woulrd map", done => {
		request.get('http://localhost:1337/world_map').end((err, res) => {
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.error).to.equal(false);
			done();
		});
	});

});