var expect = require('chai').expect;

describe('PostgreSQL', function() {
    it('should run a db server', function(done) {
        var pg = require('pg');
        pg.connect(process.env.DATABASE_URL, function(err, client) {
            expect(err).to.equal(null);
            expect(client).to.not.be.undefined;
        });
        done();
    });
});
