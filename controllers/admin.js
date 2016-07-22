var baseController = require("./base");
var View = require("../views/base");

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