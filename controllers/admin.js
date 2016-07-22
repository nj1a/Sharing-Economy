var baseController = require("./base");
var View = require("../views/base");

module.exports = baseController.extend({ 
    name: "Admin",
    run: function(req, res, next) {
        if(this.authorize(req)) {
            req.session.cea = true;
            req.session.save(function(err) {
                var v = new View(res, 'admin');
                v.render({
                    title: 'Administration',
                    content: 'Welcome to the control panel'
                });
            });         
        } else {
            var v = new View(res, 'admin');
            v.render({
                title: 'Please login'
            });
        }       
    },
    authorize: function(req) {
		return (
			req.session && 
			req.session.cea && 
			req.session.cea === true
		) || (
			req.body && 
			req.body.username === this.username && 
			req.body.password === this.password
		);
	},
});