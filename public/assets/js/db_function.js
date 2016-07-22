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
						console.log('this is result.row: '+result.rows);
						console.log('this is result.row[0]: '+result.rows[0]);
						return result.rows[0];
					}
				}
			});

		});

		console.log('i have been called');
	}
};
