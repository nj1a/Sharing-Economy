var express = require('express');
var router = express.Router();
var pg = require('pg');
var Handlebars = require('handlebars');
var Sequelize = require('sequelize');
var db = init_db();

var todoItems = [
    {id: 1, desc: 'foo'},
    {id: 2, desc: 'bar'},
    {id: 3, desc: 'baz'}
];

router.get('/', function(req, res) {
    res.render('index', { 
        title: 'App', 
        items: todoItems
    });

});

router.post('/account', function(req, res){
    var account = req.body.email;
    var password = req.body.password;
    console.log(account);
    console.log(password);
    //var query = 'SELECT * FROM user_account WHERE user_account.email = ' + '"' + account + '"' +  ' AND user_account.password =' + '"' + password + '"';
    //var query = 'SELECT * FROM user_account WHERE user_account.email = ? AND user.account.password = ?';

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM user_account', function(err, result) {
              done();
              if (err) {
                //console.log(result);
                 console.error(err); 
                 res.send("Error " + err); 
             }
             else {
                    console.log(result.rows);
                 //if (result.length === 0) {
                   // console.log(result);
                 //   res.render('account', {
                   //     results: null
                    //}); 
                 //} else {
                    //console.log(result);
                    res.render('account', {
                        results: result.rows
                    });
                 //}
                  
             }
         });
    });
    /*
    var result = res;
    var account = req.body.email;
    //console.log(account);

    var password = req.body.password;
    //console.log(password);
    var query = 'SELECT * FROM user_account WHERE user_account.email = ' + '"' + account + '"' +  ' AND user_account.password =' + '"' + password + '"';
    //console.log(query);

    db.query(query).spread( function(packages, metadata) {
            if (packages.length == 0) {
                
                result.render('account', {

                results: null
            });
            } 
            
            else {
                result.render('account', {
                results: packages

                });
                //console.log(packages);
            }
            
           
        });
*/

});

router.post('/signup', function(req, res){
    
    var result = res;
    var account = req.body.email;
    console.log(account);

    var password = req.body.password;
    console.log(password);
    var query = 'SELECT * FROM user_account WHERE user_account.email = ' + '"' + account + '"' +  ' AND user_account.password =' + '"' + password + '"';
    //console.log(query);

    db.query(query).spread( function(packages, metadata) {
            if (packages.length == 0) {
                console.log(12002001010101);
                query = 'INSERT INTO user_account (username, email, password, first_name, last_name, profile_pic, gender, phone_num, city, country, date_of_birth, date_joined, description) VALUES (' + '"'+ account + '"' + ', "' + account + '"' + ', "' + password + '"' +', "null", "null", "null", "null", "null", "toronto", "canada", "null", "null", "null");';
                console.log(query);
                db.query(query);
                query = 'SELECT * FROM user_account WHERE user_account.email = ' + '"' + account + '"' +  ' AND user_account.password =' + '"' + password + '"';
                db.query(query).spread( function(packages, metadata) {

                     result.render('account', {

                    results: packages

                }); });
                
               
            
             
        }
    
            
            else {
                console.log(999999999999);
                result.render('account', {
                results: null

                });
                console.log(packages);
            }
            
           
        });


});



router.post('/add', function(req, res) {
    var newItem = req.body.newItem;

    todoItems.push({
        id: todoItems.length + 1,
        desc: newItem
    });

    res.redirect('/');
});

router.get('/db', function (req, res) {
    
        var result = res;

       
            db.query('SELECT * FROM user_account inner join city on city.name = user_account.city and \
                city.country = user_account.country and user_account.username = "tcsbearss";')
        .spread( function(packages, metadata) {
            if (packages.length == 0) {
                console.log(packages);
                result.render('db', {

                results: null
            });
            } 
            
            result.render('db', {

                results: packages
            });
            
           
        });       
            
    });


module.exports = router;

function init_db() {
  var db = new Sequelize('db', 'user', 'pass', {
    dialect: 'sqlite',
    storage: 'db.sqlite'
  });
  return db;
}


