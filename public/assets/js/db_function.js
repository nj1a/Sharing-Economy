var pg = require('pg');
var client = 
module.exports = {
	get_info_by_post_id : function(post_id){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			client.query('SELECT post_date FROM product_post WHERE post_id ='+post_id, function(err, result){
				done();
				if (err) {
					console.log(err);
				}
				else{
					if (JSON.stringify(result.rows) === "[]") {
						console.log('-1');
						return '-1';
					} else {
						console.log(result.rows);
						console.log(result.rows[0]);
						console.log(result.rows.anonymous);
						console.log(result.rows.post_date);
						return result.rows[0];
					}
				}
			});

		});

		console.log('i have been called');
	}
};
