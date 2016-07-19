var expect = require('chai').expect;

describe("PostgreSQL", function() {
    it("is there a server running", function(done) {
        var pg = require('pg');
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            expect(err).to.equal(null);
            expect(client).to.not.be.undefined;
            done();
        });
        done();
    });
});