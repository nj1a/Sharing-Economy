var pg = require('pg');

module.exports = {
	get_info_by_post_id: function(post_id, callback){
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
	get_result: function(type, start_date, end_date, start_city, end_city, callback){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			console.log('This is get_result: \''+type+ '\'' +start_date+ ' '+end_date+ ' '+start_city);
			var query_string = 'SELECT * FROM product_post WHERE post_type = \''+type+'\' AND travel_start_date = \''+start_date+ '\' AND travel_end_date = \''+end_date+ '\' AND from_city = '+start_city+ ' AND to_city = '+end_city;
			console.log(query_string);
			client.query(query_string, function(err, result){
				done();
				if (err) throw err;
				else{
					if (JSON.stringify(result.rows) === "[]") {
						console.log('No matching row in database');
						callback('error');
					} else {
						// console.log(result.rows);
						callback(result.rows);
					}
				}
			});

		});
	},
	get_city: function(keyword, callback){
		var data = [];
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {	
			console.log("This is get_city keyword: "+keyword);
			var query_string = "select name||', '||country_name as city from city, country where city.country_id = country.country_id and name ilike \'"+keyword+"%\'";
			console.log(query_string);
			client.query(query_string, function(err, result){
				done();
				if (err) throw err;
				else{
					if (JSON.stringify(result.rows) === "[]") {
						console.log('No matching row in database');
						callback('error');
					} else {
						console.log(result.rows);
						for (var i = 0; i < result.rows.length; i++) {
							data.push(result.rows[i].city);
						};
						callback(data);
					}
				}
			});

		});
	},

	get_city_id: function(city, country, callback){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {	
			var query_string = "SELECT city_id FROM city, country WHERE country.country_id = city.country_id AND name = \'"+city+ "\' AND country_name = \'"+country+"\'";
			console.log(query_string);
			client.query(query_string, function(err, result){
				done();
				if (err) throw err;
				else{
					if (JSON.stringify(result.rows) === "[]") {
						console.log('No matching row in database');
						callback('error');
					} else {

						callback(result.rows[0]);
					}
				}
			});

		});
	},
	create_post: function(user_id, post_type, post_date, way_of_travelling, travel_start_date, travel_end_date, from_city, to_city, description, title, travel_type){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {	
			var query_string = "INSERT INTO product_post VALUE (default, "+user_id+", \'"+post_type+"\', \'"+way_of_travelling+"\', \'"+travel_start_date+"\', \'"+travel_end_date+"\', "+from_city+", "+to_city+", \'"+description+"\', \'"+title+"\', \'"+travel_type+"\', null RETURNING post_id";
			console.log(query_string);
			client.query(query_string, function(err, result){
				done();
				if (err) throw err;
				else{
					if (JSON.stringify(result.rows) === "[]") {
						console.log('No matching row in database');
						callback('error');
					} else {
						console.log(result.rows);
						callback(result.rows[0]);
					}
				}
			});

		});
	},
	// Get user id by email
	get_user_id: function(email, callback){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {	
			var query_string = "SELECT user_id FROM user_account WHERE email = \'"+email+"\'";
			console.log(query_string);
			client.query(query_string, function(err, result){
				done();
				if (err) throw err;
				else{
					if (JSON.stringify(result.rows) === "[]") {
						console.log('No matching row in database');
						callback('error');
					} else {
						console.log(result.rows);
						callback(result.rows[0]);
					}
				}
			});

		});
	}

};
