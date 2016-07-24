var pg = require('pg');
var client = 
module.exports = {
	get_info_by_post_id : function(post_id, callback){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			client.query('SELECT product_post.*, user_account.username, user_account.email, user_account.gender, user_account.date_joined, ci1.name AS departure_city, co1.country_name AS departure_country, ci2.name AS destination_city, co2.country_name AS destination_country FROM product_post, user_account, city AS ci1, city AS ci2, country AS co1, country AS co2 WHERE post_id ='+post_id+' AND product_post.user_id = user_account.user_id AND from_city = ci1.city_id AND to_city = ci2.city_id AND ci1.country_id = co1.country_id AND ci2.country_id = co2.country_id', function(err, result){
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
	},
	get_result: function(post_type, start_date, end_date, start_city, end_city, callback){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			client.query('SELECT * FROM product_post WHERE post_type = '+post_type+' AND travel_start_date = '+start_date+ ' AND travel_end_date = '+end_date+ ' AND from_city = '+start_city+ ' AND to_city = '+end_city, function(err, result){
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
