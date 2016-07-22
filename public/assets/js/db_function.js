var pg = require('pg');
var client = 
module.exports = {
	tmp : function(){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			client.query('SELECT * FROM user_account', function(err, result) {
			      done();
			      if (err) {
			         console.error(err); 
			     }
			     else {
			       
			         if (JSON.stringify(result.rows) === "[]") {
			         	return '-1';
			         } else {
			         	return result.rows;
			         }
			     }
			 });
		});

		console.log('i have been called');
	}
};
