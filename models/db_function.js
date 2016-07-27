var pg = require('pg');

module.exports = {
	get_info_by_post_id: function(post_id, callback){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			client.query('SELECT product_post.*, user_account.username, user_account.email, user_account.gender, user_account.date_joined, ci1.name AS departure_city, co1.country_name AS departure_country, co1.country_id AS departure_country_id, ci2.name AS destination_city, co2.country_name AS destination_country, co2.country_id AS destination_country_id FROM wanderland.product_post, wanderland.user_account, wanderland.city AS ci1, wanderland.city AS ci2, wanderland.country AS co1, wanderland.country AS co2 WHERE post_id ='+post_id+' AND product_post.user_id = user_account.user_id AND from_city = ci1.city_id AND to_city = ci2.city_id AND ci1.country_id = co1.country_id AND ci2.country_id = co2.country_id', function(err, result){
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
			var query_string = 'SELECT * FROM wanderland.product_post WHERE post_type = \''+type+'\' AND travel_start_date = \''+start_date+ '\' AND travel_end_date = \''+end_date+ '\' AND from_city = '+start_city+ ' AND to_city = '+end_city;
			console.log(query_string);
			client.query(query_string, function(err, result){
				done();
				if (err) throw err;
				else{
					callback(result.rows);

				}
			});

		});
	},
	get_city: function(keyword, callback){
		var data = [];
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {	
			console.log("This is get_city keyword: "+keyword);
			var query_string = "select name||', '||country_name as city from wanderland.city, wanderland.country where city.country_id = country.country_id and name ilike \'"+keyword+"%\'";
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
			var query_string = "SELECT city_id, city.country_id FROM wanderland.city, wanderland.country WHERE country.country_id = city.country_id AND name = \'"+city+ "\' AND country_name = \'"+country+"\'";
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
	create_post: function(user_id, post_type, post_date, way_of_travelling, travel_start_date, travel_end_date, from_city, to_city, description, title, travel_type, callback){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {	
			var query_string = "INSERT INTO product_post VALUES (default, "+user_id+", \'"+post_type+"\', \'"+ post_date + "\', \'"+way_of_travelling+"\', \'"+travel_start_date+"\', \'"+travel_end_date+"\', "+from_city+", "+to_city+", \'"+description+"\', \'"+title+"\', \'"+travel_type+"\', null) RETURNING post_id";
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
	},
	get_info_by_city_id: function(city_id, callback){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {	
			var query_string = "SELECT * FROM city, country where city.country_id = country.country_id AND city_id = "+city_id;
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
	get_ratings_by_city_id: function(city_id, callback){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {	
			var query_string = "SELECT * FROM city_rating, user_account where city_rating.user_id = user_account.user_id AND city_rating.city_id = "+city_id+" ORDER BY date_rated DESC ";
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
						callback(result.rows);
					}
				}
			});

		});	
	},
	get_city_by_country_id: function(country_id, callback){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {	
			var query_string = "SELECT city_id, name FROM city, country where city.country_id = country.country_id AND country.country_id = "+country_id+" ORDER BY name";
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
						callback(result.rows);
					}
				}
			});

		});	
	},
	insert_comment: function(city_id, user_id, rating, comment, date_rated, callback){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {	
			var query_string = "INSERT INTO city_rating VALUES ("+ city_id+", "+user_id + ", "+rating + ", \'"+comment+"\' , \'"+ date_rated +"\')";
			console.log(query_string);
			client.query(query_string, function(err, result){
				done();
				if (err) throw err;
				else{
					callback();
				}
			});

		});	
	},
	formatDate: function(date){
		var d = new Date(date),
		    month = '' + (d.getMonth() + 1),
		    day = '' + d.getDate(),
		    year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;
		console.log('year: '+year + ' month: '+month + ' day: '+day);
		return [year, month, day].join('-');
	},
	get_info_by_country_id: function(country_id, callback){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {	
			var query_string = "SELECT * FROM country WHERE country_id = "+country_id;
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
	get_result_suggestion: function(from_city, from_country, to_city, to_country, type, start_date, end_date, callback){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {	
			var query_string;
			if (type === 'buddy') {
				query_string = 'SELECT * FROM product_post, city AS from_city, city AS to_city WHERE product_post.from_city = from_city.city_id AND product_post.to_city = to_city.city_id AND post_type = \''+type + "\' AND from_city.country_id = "+from_country + " AND to_city.country_id = "+to_country + " AND travel_start_date + integer \'7\'>= \'" + start_date + "\' AND travel_end_date - integer \'7\' <= \'"+end_date + "\' LIMIT 5";
			}
			else if (type === 'offer_guide' || type === 'guide'){
				query_string = "SELECT * FROM product_post , city AS to_city WHERE product_post.to_city = to_city.city_id AND post_type = \'" + type + "\' AND to_city.country_id = "+to_country + " AND from_city = "+from_city + " AND travel_start_date + integer \'7\'>= \'" + start_date + "\' AND travel_end_date - integer \'7\'<= \'" + end_date + "\' LIMIT 5";
			}
			console.log(query_string);
			client.query(query_string, function(err, result){
				done();
				if (err) throw err;
				else{
					callback(result.rows);

				}
			});

		});
	},
	get_suggestion_by_city_id: function(user_id, to_city, current_date, callback){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {	
			var query_string = "SELECT * FROM product_post, user_account WHERE from_city = user_account.city_id AND user_account.user_id = "+ user_id + " AND to_city = "+ to_city + " AND travel_start_date - integer '7' <= \'"+ current_date + "\' LIMIT 10";
			console.log(query_string);

			client.query(query_string, function(err, result){
				done();
				if (err) throw err;
				else{
					if (JSON.stringify(result.rows) === "[]") {
						callback('error');
					}
					else {
						callback(result.rows);
					}
				}
			});

		});


	}


};
