var baseController = require("./Base");
var View = require("../views/Base");

module.exports = baseController.extend({ 
    name: "Admin",
    run: function(req, res, next) {
        var v = new View(res, 'admin');
        v.render({
            title: 'Administration',
            content: 'Welcome to the control panel'
        });
    }
});