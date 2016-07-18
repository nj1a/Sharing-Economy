var express = require('express');
var router = express.Router();
var pg = require('pg');

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
                 if (result.length === 0) {
                    res.render('account', {
                        results: null
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
    
    //var result = res;
    var account = req.body.email;
    //console.log(account);

    var password = req.body.password;
    //console.log(password);
    //var query = 'SELECT * FROM user_account WHERE user_account.email = ' + "'" + account + "'" +  ' AND user_account.password =' + "'" + password + "'";

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM user_account WHERE user_account.email = ' + "'" + account + "'" +  ' AND user_account.password =' + "'" + password + "'" , function(err, result) {
              done();
              console.log("hahahahahahahahaha fuck youuuuuuu  111111           "+ JSON.stringify(result.rows));
              if (err) {
                 console.error(err); 
                 res.send("Error " + err); 
             }
             else {
                  console.log("hahahahahahahahaha fuck youuuuuuu             "+result.rows);
                 if (result.length === 0) {
                    query = 'INSERT INTO user_account (username, email, password, first_name, last_name, profile_pic, gender, phone_num, city, country, date_of_birth, date_joined, description) VALUES (' + "'"+ account + "'" + ", '" + account + "'" + ", '" + password + "'" +', "null", "null", "null", "null", "null", "toronto", "canada", "null", "null", "null");';
                    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                        client.query(query, function(err, result) {
                            done();
                            console.log("hahahahahahahahaha fuck youuuuuuu             "+result.rows);
                            if (err) {
                                 console.error(err); 
                                 res.send("Error " + err); 
                             }
                        });
                    });

                    query = 'SELECT * FROM user_account WHERE user_account.email = ' + "'" + account + "'" +  ' AND user_account.password =' + "'" + password + "'";
                    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                        client.query(query, function(err, result){
                        done();
                        if (err) {
                            console.error(err); 
                            res.send("Error " + err);
                        } else {
                            res.render('account', {
                                results: result.rows
                            });
                        }
                    });
                        
                    });
                    
                     
                 } else {
                    res.render('account', {
                        results: null
                    });
                 }
             }
         });
    });


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
});

module.exports = router;



