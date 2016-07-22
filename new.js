var express = require('express');
var router = express.Router();
var pg = require('pg');
var tool = require('./public/assets/js/db_function');

router.get('/', function(req, res) {
    res.render('index');
});

router.post('/account', function(req, res){
    var account = req.body.email;
    var password = req.body.password;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM user_account WHERE user_account.email = ' +  "'"+ account + "'" +  ' AND user_account.password =' + "'" + password + "'" , function(err, result) {
              done();
              if (err) {
                 console.error(err); 
                 res.send("Error " + err); 
             }
             else {
               
                 if (JSON.stringify(result.rows) === "[]") {
                    res.render('account', {
                        results: '-1'
                    }); 
                 } else {
                    res.render('account', {
                        results: result.rows
                    });
                 }
             }
         });
    });
});

router.post('/signup', function(req, res){
    
    var account = req.body.email;
   

    var password = req.body.password;

   

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM user_account WHERE user_account.email = ' + "'" + account + "'" +  ' AND user_account.password =' + "'" + password + "'" , function(err, result) {
              done();

              //console.log("                                 1                      "+ result.rows.email);
              if (err) {
                 console.error(err); 
                 res.send("Error " + err); 
             } else {
                if (JSON.stringify(result.rows) === "[]") {
                    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                        //var query = 'INSERT INTO user_account (username, email, password, first_name, last_name, profile_pic, gender, phone_num, city, country, date_of_birth, date_joined, description) VALUES (' + "'"+ account + "'" + "," + "'" + account + "'" + "," + "'" + password + "'" + "," + 'null' + ', ' + 'null, ' + 'null, ' + 'null, ' + ' null, ' + "'" + 'toronto'+ "'" + "'" + ', canada,' + "'"  + 'null, ' + 'null, ' + 'null' + ');';
                       // console.log("hahaha   " + query);

                        client.query('INSERT INTO user_account (username, email, password, first_name, last_name, profile_pic, gender, phone_num, city, country, date_of_birth, date_joined, description) VALUES (' + "'"+ account + "'" + ", '" + account + "'" + ", '" + password + "'" +', ' + 'NULL' + ', ' + 'NULL, ' + 'NULL, ' + 'NULL, ' + ' NULL, ' + "'" + 'toronto' + "'" + "," + "'" + 'canada' + "'" + ',NULL, ' + 'NULL, ' + 'NULL' + ');', function(err, result){
                            done();
                            if (err) {
                                console.error(err); 
                                res.send("Error " + err);
                            }
                        });
                        
                    });

                    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                        //var query = 'INSERT INTO user_account (username, email, password, first_name, last_name, profile_pic, gender, phone_num, city, country, date_of_birth, date_joined, description) VALUES (' + "'"+ account + "'" + "," + "'" + account + "'" + "," + "'" + password + "'" + "," + 'null' + ', ' + 'null, ' + 'null, ' + 'null, ' + ' null, ' + "'" + 'toronto'+ "'" + "'" + ', canada,' + "'"  + 'null, ' + 'null, ' + 'null' + ');';
                       // console.log("hahaha   " + query);

                        client.query('SELECT * FROM user_account WHERE user_account.email = ' + "'" + account + "'" +  ' AND user_account.password =' + "'" + password + "'", function(err, result){
                            done();
                            if (err) {
                                console.error(err); 
                                res.send("Error " + err);
                            } else {
                                console.log(JSON.stringify(result.rows));
                                res.render('account', {
                                    results: result.rows
                                });
                            }
                        });
                        
                    });


    
                    
                 } else {
                    res.render('account', {
                        results: "-1"
                    });
                 }
                
                  
              
              
                //console.log("                                 2                      "+ result.rows.length);
                   //console.log("                                 3                      "+ result.rows.first_name);
                                   
            }
             
        });
    });
});
// Post page
router.get('/post/:postId', function(req, res){
    var username, type, post_date, way_of_travelling, travel_start_date, travel_end_date;

    tool.get_info_by_post_id(req.params.postId, function(result){
        if (result === 'error') {
          res.send('No such result in database');
        }else{
          res.render('post', {username: result['username'], post_date: result['post_date']});

        };
    });
    // console.log(typeof post_date.toISOString());
    // post_date = post_date.toISOString();
    // tool.tmp();
    // res.send('This is post page with id is '+req.params.postId);
});

module.exports = router;

 /*  db.query(query).spread( function(packages, metadata) {
            if (packages.length === 0) {
                //console.log(12002001010101);
                query = 'INSERT INTO user_account (username, email, password, first_name, last_name, profile_pic, gender, phone_num, city, country, date_of_birth, date_joined, description) VALUES (' + '"'+ account + '"' + ', "' + account + '"' + ', "' + password + '"' +', "null", "null", "null", "null", "null", "toronto", "canada", "null", "null", "null");';
                //console.log(query);
                db.query(query);
                query = 'SELECT * FROM user_account WHERE user_account.email = ' + '"' + account + '"' +  ' AND user_account.password =' + '"' + password + '"';
                db.query(query).spread( function(packages, metadata) {

                    result.render('account', {

                        results: packages

                    }); 
                });
            } else {
                console.log(999999999999);
                result.render('account', {
                results: null
                });
            }
        });*/



