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
    
    var result = res;
    var account = req.body.email;
    console.log(account);

    var password = req.body.password;
    console.log(password);
    var query = 'SELECT * FROM user_account WHERE user_account.email = ' + '"' + account + '"' +  ' AND user_account.password =' + '"' + password + '"';
    console.log(query);

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


