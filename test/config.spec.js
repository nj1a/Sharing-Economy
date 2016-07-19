var expect = require('chai').expect;

describe('Configuration setup', function() {
    it('should load local configurations', function(done) {
        var config = require('../config')();
        expect(config.mode).to.equal('local');
        done();
    });
    it('should load staging configurations', function(done) {
        var config = require('../config')('staging');
        expect(config.mode).to.equal('staging');
        done();
    });
    it('should load production configurations', function(done) {
        var config = require('../config')('production');
        expect(config.mode).to.equal('production');
        done();
    });
});
