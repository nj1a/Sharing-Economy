var pg = require('pg');
var client = 
module.exports = {
	get_info_by_post_id : function(post_id, callback){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			client.query('SELECT * FROM product_post, user_account, city AS ci1, city AS ci2, country AS co1, country AS co2 WHERE post_id ='+post_id+' AND product_post.user_id = user_account.user_id AND from_city = ci1.city_id AND to_city = ci2.city_id AND ci1.country_id = co1.country_id AND ci2.country_id = co2.country_id', function(err, result){
				done();
				if (err) throw err;
				else{
					if (JSON.stringify(result.rows) === "[]") {
						console.log('No matching row in database');
						callback('error');
					} else {
						console.log(result.rows[0]);
						callback(result.rows[0]);
					}
				}
			});

		});
	}
};
