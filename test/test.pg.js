var expect = require('chai').expect;

describe('PostgreSQL', () => {
    // test pg connection
    it('should run a db server', done => {
        var pg = require('pg');
        pg.connect(process.env.DATABASE_URL, (err, client) => {
            expect(err).to.equal(null);
            expect(client).to.not.be.undefined;
        });
        done();
    });
});
 