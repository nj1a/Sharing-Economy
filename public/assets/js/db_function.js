var pg = require('pg');
var client = 
module.exports = {
	get_info_by_post_id : function(post_id, callback){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			client.query('SELECT * FROM product_post, user_account WHERE post_id ='+post_id+' AND user_id = user_account.id', function(err, result){
				done();
				if (err) throw err;
				else{
					if (JSON.stringify(result.rows) === "[]") {
						console.log('No matching row in database');
						callback('error');
					} else {
						// console.log(result.rows[0]);
						callback(result.rows[0]);
					}
				}
			});

		});

		console.log('i have been called');
	}
};
