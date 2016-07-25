var pg = require('pg');

module.exports = {
	update_email: function(newEmail, sess, req, res){

	    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	        client.query('UPDATE wanderland.user_account SET email = ' + "'" + newEmail + "'" + 'WHERE user_account.email = ' +  "'"+ sess.email + "'" , function(err, result){
	            done();
	            console.log("here" + newEmail);
	            if (err) {
	                console.error(err); 
	                res.send("Error " + err);
	            } else {
	                
	                pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	                    client.query('SELECT * FROM wanderland.user_account WHERE wanderland.user_account.email = ' +  
	                        "'"+ newEmail + "'" , function(err, result) {
	                            done();
	                            console.log("hoho" + JSON.stringify(result.rows[0]));
	                            if (err) {
	                                console.error(err); 
	                                res.send("Error " + err); 
	                             }
	                            else {
	                            	sess.email = newEmail;  
	                            	console.log(sess.email);
	                                res.render('profile', {

	                                    results: result.rows,
	                                    errors: ''
	                                    });

	                            }
	                        }); 
	                });
	            }

	        });                            
		});
	}, 

	update_name: function(first_name, last_name, sess_email, req, res){

		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			console.log('UPDATE wanderland.user_account ' + 
	        			 'SET first_name = ' + "'" + first_name + "'" + ', ' + 
	        			 'last_name = ' + "'" + last_name + "'" + 
	        			 'WHERE user_account.email = ' +  "'"+ sess_email + "'" );
	        client.query('UPDATE wanderland.user_account ' + 
	        			 'SET first_name = ' + "'" + first_name + "'" + ', ' + 
	        			 'last_name = ' + "'" + last_name + "'" + 
	        			 'WHERE user_account.email = ' +  "'"+ sess_email + "'" , function(err, result){

	            done();
	            
	            if (err) {
	                console.error(err); 
	                res.send("Error " + err);
	            } else {

	                pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	                    client.query('SELECT * FROM wanderland.user_account WHERE wanderland.user_account.email = ' +  
	                        "'"+ sess_email + "'" , function(err, result) {
	                            done();
	                           
	                            if (err) {
	                                console.error(err); 
	                                res.send("Error " + err); 
	                             }
	                            else {  
	                                res.render('profile', {

	                                    results: result.rows,
	                                    errors: ''
	                                    });

	                            }
	                        }); 
	                });
	            }

	        });                            
		});


	},

	update_address: function(city, country, sess_email, req, res) {
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			console.log('UPDATE wanderland.user_account ' + 
	        			 'SET city = ' + "'" + city + "'" + ', ' + 
	        			 'country = ' + "'" + country + "'" + 
	        			 'WHERE user_account.email = ' +  "'"+ sess_email + "'" );
	        client.query('UPDATE wanderland.user_account ' + 
	        			 'SET city = ' + "'" + city + "'" + ', ' + 
	        			 'country = ' + "'" + country + "'" + 
	        			 'WHERE user_account.email = ' +  "'"+ sess_email + "'" , function(err, result){

	            done();
	            
	            if (err) {
	                console.error(err); 
	                res.send("Error " + err);
	            } else {

	                pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	                    client.query('SELECT * FROM wanderland.user_account WHERE wanderland.user_account.email = ' +  
	                        "'"+ sess_email + "'" , function(err, result) {
	                            done();
	                           
	                            if (err) {
	                                console.error(err); 
	                                res.send("Error " + err); 
	                             }
	                            else {  
	                                res.render('profile', {

	                                    results: result.rows,
	                                    errors: ''
	                                    });

	                            }
	                        }); 
	                });
	            }

	        });                            
		});

	},

	update_phone: function(phone_num, sess_email, req, res) {

		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	        client.query('UPDATE wanderland.user_account ' + 
	        			 'SET phone_num = ' + "'" + phone_num + "'" + 
	        			 'WHERE user_account.email = ' +  "'"+ sess_email + "'" , function(err, result){
	            done();
	            
	            if (err) {
	                console.error(err); 
	                res.send("Error " + err);
	            } else {
	                
	                pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	                    client.query(' SELECT *' + 
	                    			 '	FROM wanderland.user_account '+
	                    			 ' WHERE user_account.email = ' + "'"+ sess_email + "'" , function(err, result) {
	                            done();
	                            console.log("hoho" + JSON.stringify(result.rows[0]));
	                            if (err) {
	                                console.error(err); 
	                                res.send("Error " + err); 
	                             }
	                            else {  
	                                res.render('profile', {

	                                    results: result.rows,
	                                    errors: ''
	                                    });

	                            }
	                        }); 
	                });
	            }

	        });                            
		});

	},

	update_dob: function(dob, sess_email, req, res) {
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	        client.query('UPDATE wanderland.user_account' + 
	        			 'SET date_of_birth = ' + "'" + dob + "'" + 
	        			 'WHERE user_account.email = ' +  "'"+ sess_email + "'" , function(err, result){
	            done();
	            //console.log("here" + newEmail);
	            if (err) {
	                console.error(err); 
	                res.send("Error " + err);
	            } else {
	                
	                pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	                    client.query(' SELECT *' + 
	                    			 ' FROM wanderland.user_account '+
	                    			 ' WHERE wanderland.user_account.email = ' + "'"+ sess_email + "'" , function(err, result) {
	                            done();
	                            console.log("hoho" + JSON.stringify(result.rows[0]));
	                            if (err) {
	                                console.error(err); 
	                                res.send("Error " + err); 
	                             }
	                            else {  
	                                res.render('profile', {

	                                    results: result.rows,
	                                    errors: ''
	                                    });

	                            }
	                        }); 
	                });
	            }

	        });                            
		});

	},

	update_gender: function(gender, sess_email, req, res) {
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	        client.query('UPDATE wanderland.user_account ' + 
	        			 'SET gender = ' + "'" + gender + "'" + 
	        			 'WHERE user_account.email = ' +  "'"+ sess_email + "'" , function(err, result){
	            done();
	            //console.log("here" + newEmail);
	            if (err) {
	                console.error(err); 
	                res.send("Error " + err);
	            } else {
	                
	                pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	                    client.query(' SELECT *' + 
	                    			 ' FROM wanderland.user_account '+
	                    			 ' WHERE wanderland.user_account.email = ' + "'"+ sess_email + "'" , function(err, result) {
	                            done();
	                            console.log("hoho" + JSON.stringify(result.rows[0]));
	                            if (err) {
	                                console.error(err); 
	                                res.send("Error " + err); 
	                             }
	                            else {  
	                                res.render('profile', {

	                                    results: result.rows,
	                                    errors: ''
	                                    });

	                            }
	                        }); 
	                });
	            }

	        });                            
		});

	},

	update_description: function(desc, sess_email, req, res) {
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	        client.query('UPDATE wanderland.user_account ' + 
	        			 'SET description = ' + "'" + desc + "'" + 
	        			 'WHERE user_account.email = ' +  "'"+ sess_email + "'" , function(err, result){
	            done();	            
	            if (err) {
	                console.error(err); 
	                res.send("Error " + err);
	            } else {
	                
	                pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	                    client.query(' SELECT *' + 
	                    			 ' FROM wanderland.user_account '+
	                    			 ' WHERE wanderland.user_account.email = ' + "'"+ sess_email + "'" , function(err, result) {
	                            done();
	                            console.log("hoho" + JSON.stringify(result.rows[0]));
	                            if (err) {
	                                console.error(err); 
	                                res.send("Error " + err); 
	                             }
	                            else {  
	                                res.render('profile', {

	                                    results: result.rows,
	                                    errors: ''
	                                    });

	                            }
	                        }); 
	                });
	            }

	        });                            
		});

	},


	sendDefault: function(sess_email, error_msg, req, res){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	        client.query('SELECT * FROM wanderland.user_account WHERE wanderland.user_account.email = ' +  
	            "'"+ sess_email + "'" , function(err, result) {
	                done();
	                console.log(JSON.stringify(result.rows[0]));
	                if (err) {
	                    console.error(err); 
	                    res.send("Error " + err); 
	                 }
	                else {                                                     
	                    res.render('profile', {results: result.rows, errors: error_msg});
	                }
	            }); 
	    });
	}

};

