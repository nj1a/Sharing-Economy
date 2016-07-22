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
			         	console.log('-1');
			         	return '-1';
			         } else {
			         	console.log(result.rows);
			         	return result.rows;
			         }
			     }
			 });
		});

		console.log('i have been called');
	}
};
