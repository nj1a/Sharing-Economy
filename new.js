var express = require('express');
var router = express.Router();
var pg = require('pg');

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

router.post('/add', function(req, res) {
    var newItem = req.body.newItem;

    todoItems.push({
        id: todoItems.length + 1,
        desc: newItem
    });

    res.redirect('/');
});

router.get('/db', function (req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM user_account inner join city on city.name = user_account.city and city.country = user_account.country', function(err, result) {
            done();
            if (err) { 
                console.error(err); 
                res.send("Error " + err); 
            }
            else { 
                res.render('db', {
                    results: result.rows
                }); 
            }
        });
    });
});

module.exports = router;