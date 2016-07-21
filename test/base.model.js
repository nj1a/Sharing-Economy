var expect = require('chai').expect;
var Model = require('../model/base');
var dbMockup = {};

describe('Models', function() {
    it('should create a new model', function(next) {
        var model = new Model(dbMockup);
        expect(model.db).to.not.be.undefined;
        expect(model.extend).to.not.be.undefined;
        next();
    });
    it('should be extendable', function(next) {
        var model = new Model(dbMockup);
        var OtherTypeOfModel = model.extend({
            myCustomModelMethod: function() { }
        });

        var model2 = new OtherTypeOfModel(dbMockup);
        expect(model2.db).to.not.be.undefined;
        expect(model2.myCustomModelMethod).to.not.be.undefined;
        next();
    });
});