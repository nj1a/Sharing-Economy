var express = require('express');
var session = require('express-session');
var pg = require('pg');
var fs = require('fs');
var busboy = require('connect-busboy');
var expressValidator = require('express-validator');
var sha256 = require('js-sha256');
var glob = require('glob');
var router = express.Router();
var csrf = require('csurf');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var update_handler = require("../models/handle_update.js");
var tool = require('../models/db_function');

var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });

router.use(busboy());
router.use(cookieParser());

// performance
var compression = require('compression');
router.use(compression());

var sess;

function validateEmail(email) {
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
}

function validateBlackList(password) {
    // I pulled out the , and - because the city and date use them
    var blackListedChar = "<>./:;'|{}[]_+=!@#$%^&*()`~?";
    for (var i = 0; i < blackListedChar.length; i++) {
        if (password.includes(blackListedChar[i])) {
            return false;
        }
    }
    return true;
}

router.use(session({secret: 'shhhhh',
                    resave: true,
                    saveUninitialized: false,
                    cookie: {maxAge: 50000000}
                }));

router.use(expressValidator({
    customValidators: {

        isValid: function(value) {
            var usrRegex = new RegExp("^[a-zA-Z0-9äöüÄÖÜ]*$");

            if (usrRegex.test(value)) {
                return true;
            }
            return false;
        },
        isCorrectPW: function(value, q) {

            if (q === undefined || JSON.parse(q).password !== value  ) {
                return false;
            }
            return true;

        },
        doesExist: function(value, q) {
            if (q === undefined) {
                return true;
            } else {
                if (value === JSON.parse(q).email) {
                    return false;
                }
                else {
                    return true;
                }
            }
        },
        doesNotExist: function(value, q) {
            if (q === undefined) {
                return false;
            } else {
                if (value === JSON.parse(q).email) {
                    return true ;
                }
            }
        },
        usernameAvailable: function(value, q) {

            if (q === undefined || JSON.parse(q).username !== value ){
                return true;
            } else{
                return false;
            }
        }
    }
}));

router.post('/admin_sign', function(req, res){
    sess = req.session;
    var password = sha256(req.body.password);
    var email = req.body.email;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query('SELECT count(*) FROM wanderland.user_account WHERE wanderland.user_account.email = ' +
                "'"+ email + "'" +  ' AND wanderland.user_account.password =' + "'" + password + "'" + ' AND wanderland.user_account.is_admin = ' + "'" +'t' + "'", function(err, result) {
                    console.log('SELECT count(*) FROM wanderland.user_account WHERE wanderland.user_account.email = ' +
                "'"+ email + "'" +  ' AND wanderland.user_account.password =' + "'" + password + "'" + ' AND wanderland.user_account.is_admin = ' + "'" +'t' + "'");
                    console.log(JSON.stringify(result.rows[0].count));
                    done();
                    if (err) {
                        res.send("Error " + err);
                    }
                    if (result.rows[0].count === '0'){
                        res.render("admin", {errors: "invalid login information"});
                    } else{
                        sess.email = req.body.email;
                        res.redirect("/login_success");
                    }

});});});

router.post('/login', function(req, res){
    sess = req.session;
    var email = req.body.email;
    var password = sha256(req.body.pass);
    var username = req.body.username;

    if (validateEmail(email) && validateBlackList(password)) {
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query('SELECT * FROM wanderland.user_account WHERE wanderland.user_account.email = ' +
                "'"+ email + "'" +  ' AND wanderland.user_account.password =' + "'" +
                password + "'" , function(err, result) {
                    console.log(JSON.stringify(result.rows[0]));
                    done();
                    if (err) {
                        res.send("Error " + err);
                     }
                    else {
                        req.checkBody("email", 'Wrong email and password combination').doesNotExist(JSON.stringify(result.rows[0]));

                        var errors = req.validationErrors();
                        var mappedErrors = req.validationErrors(true);

                        if (errors) {

                            var errorMsgs = { "errors": {} };

                            errorMsgs.errors.status = "display: block";

                            if ( mappedErrors.email ) {
                                errorMsgs.errors.error_email = mappedErrors.email.msg;
                            }
                            res.end('loginFail');
                        } else {
                            sess.email = email;
                            sess.pass = password;
                            sess.username = username;
                            sess.currId = result.rows[0].user_id;
                            console.log("current session ID:  " + sess.currId);
                            res.end('done');
                        }
                    }
                });
            });
    }
});



router.get('/', csrfProtection, function(req, res) {
    sess = req.session;

    if (sess.email) {
        res.redirect('/login_success');
    } else {
        if (!sess.error_msg) {
            sess.error_msg = '';
            res.render('index', {
                errors: sess.error_msg//,
                //csrfToken: req.csrfToken()
            });
        } else {
            res.render('index', {
                errors: sess.error_msg.errors//,
                //csrfToken: req.csrfToken()
            });
        }
    }
});

router.get("/login_success", function(req, res) {
    sess = req.session;
    if (sess.email){
        res.render("login_success");
    } else{
        res.redirect('/');
    }
});
// Create post form
router.get('/create_post', csrfProtection, function(req, res){
    if (typeof sess === 'undefined' || typeof sess.email === 'undefined') {
        res.send('You need to sign in first');
    }else{
        res.render('create_post');
    }
});
// World map search
router.get('/world_map', csrfProtection, function(req, res){
    res.render('world_map');

});
// Convert ISO country code to country id
router.get('/get_country', function(req, res){
    if (req.query.key === 'undefined') {
        res.send('Error, please enter your key');
        return;
    }
    tool.get_country(req.query.key, function(result){
        if (result === 'error') {
            res.send('No matching result');
        }
        else{
            res.redirect('/country/'+result[0].country_id);
            // res.send(JSON.stringify(result));
            // console.log('This is getcountry: '+ result[0].country_id + result[0].country_code + result[0].country_name);
            // console.log('hi');
            // res.send('Country ID is : '+result.country_id);
        }

    });

});
router.post('/result', function(req, res) {
    console.log(req.body);
    console.log('hi');
    console.log('Type: '+ typeof req.body.from_date + ' '+ typeof req.body.to_date + ' ' + typeof req.body.from_city + ' ' + typeof req.body.to_city);
    if (typeof req.body.from_date === "undefined" || typeof req.body.to_date === "undefined" || typeof req.body.from_city === "undefined" || typeof req.body.to_city === "undefined" || req.body.to_date === 'what day' || req.body.from_date === 'what day' || req.body.from_city === 'what city' || req.body.to_city === 'what city') {
        res.redirect('/');
    }
    else{
        var from_date = req.body.from_date;
        var to_date = req.body.to_date;
        var from_city = req.body.from_city.split(", ")[0];
        var from_country = req.body.from_city.split(", ")[1];
        var to_city = req.body.to_city.split(", ")[0];
        var to_country = req.body.to_city.split(", ")[1];

        var validatation = validateBlackList(from_city) && validateBlackList(from_country) &&
                             validateBlackList(to_city) && validateBlackList(to_country);

        if (validatation) {
            console.log("Type2: "+ typeof from_city + ' '+typeof to_city + ' '+typeof from_country + ' '+ typeof to_country);
            if (typeof from_city === 'undefined' || typeof to_city === 'undefined' || typeof from_country === 'undefined' || typeof to_country === 'undefined') {
                res.send('Please enter both city and country name');
            }
            else{
                // Get the city ids from city name and country name
                var from_city_id, to_city_id, to_country_id;
                tool.get_city_id(from_city, from_country, function(result1){
                    from_city_id = result1.city_id;
                    var from_country_id = result1.country_id;
                    tool.get_city_id(to_city, to_country, function(result2){
                        to_city_id = result2.city_id;
                        to_country_id = result2.country_id;
                        tool.get_result(req.body.post_type, from_date, to_date, from_city_id, to_city_id, function(result3){

                            tool.get_result_suggestion(from_city_id, from_country_id, to_city_id, to_country_id, req.body.post_type, from_date, to_date, function(suggestions){


                                if (result1 === 'error' || result2 === 'error') {
                                    res.send('No matching result');

                                }else{
                                    // res.send(JSON.stringify(result));
                                    // console.log('This is result object: ', result3);
                                    res.render("result", {

                                        result: result3,
                                        suggestions: suggestions
                                        //,
                                        //csrfToken: req.csrfToken()

                                    });
                                }


                            });


                        });

                    });

                });
            }
        }
        else {
            res.send('Error on validation');
        }
        // res.render('result', { title: 'result', message: 'results'});
    }
});

router.get('/get_city', function(req, res){
    tool.get_city(req.query.key, function(result){
        if (result === 'error') {
            res.send('No matching result');
        }
        else{
            res.send(JSON.stringify(result));
        }
        console.log('test');
    });

});
router.get('/city/:cityID', csrfProtection, function(req, res){

    tool.get_info_by_city_id(req.params.cityID, function(city_info){
        if (city_info === 'error') {
            res.send('City not found');
        }else{
            // Look for main images
            glob('public/img/city_images/'+req.params.cityID+'_*.*', function(er, main_images){
                if (er) {
                    throw er;
                }
                for (var i = 0; i < main_images.length; i++) {
                    main_images[i] = main_images[i].replace('public', '..');
                }
                // Look for attraction images
                glob('public/img/city_images/attraction_'+req.params.cityID+'_*.*', function(er, files){
                    if (er) {
                        throw er;
                    }
                    var attraction_images = {};
                    for (var i = 0; i < files.length; i++) {
                        files[i] = files[i].replace('public', '..');
                        var current_image = files[i];
                        var attraction_name = current_image.slice(current_image.lastIndexOf('/')+1, current_image.lastIndexOf('.'));
                        attraction_name = attraction_name.slice(attraction_name.lastIndexOf('_')+1);
                        attraction_name = attraction_name.replace(/-/g, ' ');
                        attraction_name = attraction_name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

                        attraction_images[files[i]] = attraction_name;
                    }
                    // Get ratings and comments
                    tool.get_ratings_by_city_id(req.params.cityID, function(ratings){
                        var user_id;
                        if (ratings === 'error') {
                            console.log('!B');
                            res.send('City not found');
                            ratings = {};
                        }

                        for (var i = 0; i < ratings.length; i++) {
                            ratings[i].date_rated = tool.formatDate(ratings[i].date_rated);
                        }
                        if (typeof sess === 'undefined' || typeof sess.currId === 'undefined' ) {
                            user_id = -1;
                        }
                        else {
                            user_id = sess.currId;
                        }
                        var current_date = new Date();
                        current_date = tool.formatDate(current_date);

                        tool.get_suggestion_by_city_id(user_id, req.params.cityID, current_date, function(suggestions){
                            if (suggestions === 'error') {
                                suggestions = false;
                            }
                            res.render('city', {
                                city_info: city_info,
                                csrfToken: req.csrfToken(),
                                main_images: main_images,
                                attraction_images: attraction_images,
                                ratings: ratings,
                                suggestions: suggestions
                            });
                        });

                    });
                });


            });

        }
    });



});

router.post('/city/:cityID', function(req, res){
    if (typeof sess === 'undefined' || typeof sess.currId === 'undefined') {
        res.send('You need to sign in first');
        return;
    }
    if (req.body.comment && req.body.rating) {
        if (typeof req.body.rating === 'string' && req.body.rating >= 1 && req.body.rating <= 5 && req.body.comment !== 'Type your travellng experience in this city here') {
            var date_rated = new Date();
            date_rated = tool.formatDate(date_rated);

            tool.insert_comment(req.params.cityID, sess.currId, req.body.rating, req.body.comment, date_rated, function(){
                res.redirect('/city/'+req.params.cityID);

            });

        }
        else{
            res.send('Please enter valid rating (ie. 1 to 5) and valid comment');
        }

    } else{
        res.send('Please enter valid rating (ie. 1 to 5) and valid comment');
    }


});
router.get('/country/:countryID', csrfProtection, function(req, res){
    glob('public/img/country_images/'+req.params.countryID+'_*.*', function(er, main_images){
        if (er) {
            throw er;
        }
        // Format the file path
        for (var i = 0; i < main_images.length; i++) {
            console.log('looped');
            main_images[i] = main_images[i].replace('public', '..');
        }
        tool.get_info_by_country_id(req.params.countryID, function(country_info){
            if (country_info === 'error') {
                res.send('No such country');
            }
            else{
                tool.get_city_by_country_id(req.params.countryID, function(related_cities){
                    if (related_cities === 'error') {
                        // res.send('No such country');
                        related_cities = {};
                    }


                    res.render('country', {
                        main_images: main_images,
                        country_info: country_info,
                        related_cities: related_cities
                        //csrfToken: req.csrfToken()
                    });
                });
            }
        });
    });

});


router.get('/admin-manage', csrfProtection, function(req, res) {

    res.render('admin-manage', {
        title: 'admin_manage',
        message: 'adminManage'//,
        //csrfToken: req.csrfToken()
    });
});

router.post('/enter-data', function(req, res) {
    var country = req.body.country;
    var country_code = req.body.country_code;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('INSERT INTO wanderland.country VALUES (' + 'default' + ',' +
            "'" + country_code + "'" + ',' + "'" + country + "'" +
            ');', function(err){
                done();
                if (err) {
                    res.send("Error " + err);
                    // change the erro message later
                }
                res.redirect('/admin-manage');
                });
    });
});

router.get('/admin', function(req, res) {
    sess = req.session;

    if (sess.email) {
        res.redirect('/profile');
    } else {
        if (!sess.error_msg) {
            sess.error_msg = '';
            res.render('admin', {
                errors: sess.error_msg//,
                //csrfToken: req.csrfToken()
            });
        } else {
            res.render('admin', {
                errors: sess.error_msg.errors//,
                //csrfToken: req.csrfToken()
            });
        }
    }
});

router.get('/profile', function(req, res){
    sess=req.session;

    if (sess.email){

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {

            client.query('SELECT * FROM wanderland.user_account WHERE wanderland.user_account.email = ' +
                "'"+ sess.email + "'" , function(err, result1) {

                done();
                if (err) {
                    res.send("Error " + err);
                } else {
                    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                        client.query('select user_id from wanderland.user_account where email = ' + "'" + sess.email + "'", function(err, result){
                            done();
                            if (err) {
                                res.send("Error " + err);
                            }
                            var usrID = JSON.stringify(result.rows[0].user_id);
                            var path;
                            if (fs.existsSync('public/img/' + "profile_" + usrID)) {
                                console.log("This person has a updated img");
                                path = '/img/' + "profile_" + usrID;
                            } else {
                                path = '/img/default_profile.jpg';
                            }

                            if(sess.google){

                            }
                            res.render('profile', {
                                results: result1.rows,
                                //csrfToken: req.csrfToken(),
                                errors: ' ',
                                type: 'own',
                                pic: path
                            });
                        });
                    });
                }
            });
        });

    } else {
        res.redirect('/');
    }
});

router.get('/viewusr/:username', function(req, res){

    sess=req.session;
    var targetUser= req.params.username;

    if (!sess.email){
        res.send("not logged in");
    } else {
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM wanderland.user_account WHERE wanderland.user_account.username = ' +
            "'"+ targetUser + "'" , function(err, result) {
            done();
            if (err) {
                res.send("Error " + err);
             }
            else {
               sess.targetUser = result.rows[0].email;
               //sess.targetUserId = result.rows[0].user_id;
               res.send("good");
            }
        });
    });

    }



});

router.get('/showusr', function(req, res){
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query('SELECT * FROM wanderland.user_account WHERE wanderland.user_account.email = ' +
                "'"+ sess.targetUser + "'" , function(err, result1) {
                done();
                if (err) {
                    res.send("Error " + err);
                 }
                else {
                    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                        client.query('select user_id from wanderland.user_account where email = ' + "'" + sess.targetUser + "'", function(err, result){
                            done();
                            if (err) {
                                res.send("Error " + err);
                            }
                            var usrID = JSON.stringify(result.rows[0].user_id);
                            var path;
                            if (fs.existsSync('public/img/' + "profile_" + usrID)) {
                                path = '/img/' + "profile_" + usrID;
                            } else {
                                path = '/img/default_profile.jpg';
                            }

                            var friendshipExists;
                             pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                                client.query('select count(*) as count from wanderland.friendship where first_user_id = ' + "'" + sess.currId + "'" +  ' and second_user_id = ' + "'" + usrID + "'", function(err, result2){
                                    done();
                                    if (err) {
                                        res.send("Error " + err);
                                    }



                                    if (result2.rows[0].count === '0') {
                                        //console.log("hohohahahahohao" + result2.rows[0].count);
                                        friendshipExists = "Send request for friends";
                                    } else {
                                        friendshipExists = 'already friends';
                                    }

                                    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                                        client.query('select count(*) as count from wanderland.request where from_user_id = ' + "'" + sess.currId + "'" +  ' and to_user_id = ' + "'" + usrID + "'", function(err, result3){
                                            done();
                                            if (err) {
                                                res.send("Error " + err);
                                            }

                                            if (result3.rows[0].count === '1') {
                                                friendshipExists = "request has been sent";
                                            }

                                            res.render('viewusr', {
                                            results: result1.rows,
                                            errors: ' ',
                                            type: sess.email,
                                            pic: path,
                                            friendship: friendshipExists
                                        });
                                    });

                                    //console.log(result2.rows[0].count);


                                //csrfToken: req.csrfToken()

                                    });

                                });
                            });




                        });
                    });

                }
            });
        });
});

router.get('/logout',function(req,res){
    req.session.destroy(function(err) {
        if(err) {
        res.end(err);
        } else {
        res.redirect('/');
        }
    });
});

router.get('/findUser/:email', function(req, res){
    var userEmail = req.params.email;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('select * from wanderland.user_account where email = ' + "'" + userEmail + "'", function(err, result){
            done();
            if (err) {
                res.send("Error " + err);
            }
        console.log(result.rows);

        res.send(result.rows);


        });
    });
});

router.post("/adminUpdate", function(req, res){
    var user_id = req.body.user_id;
    var email = req.body.email;
    var password = sha256(req.body.password);
    var username = req.body.username;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var gender = req.body.gender;
    var phone_num = req.body.phone_num;
    var city_id = req.body.city_id;
    var country_id = req.body.country_id;
    var date_of_birth = req.body.date_of_birth;
    var description = req.body.description;


    update_handler.update_account(user_id, username, email, password, first_name,
                                  last_name, gender, phone_num, city_id,
                                  country_id, date_of_birth, description, req, res);



    console.log(req.body);
    //res.send(email);

});

router.get('/deleteUser/:email', function(req, res){
    var userEmail = req.params.email;

   pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('delete * from wanderland.user_account where email = ' + "'" + userEmail + "'", function(err, result){
            done();
            if (err) {
                res.send("Error " + err);
            }
        console.log(result.rows);

        res.send(result.rows);


        });
    });
    //console.log(userEmail);

    res.send(userEmail);
});

router.post('/createUser', function(req, res){
    var email = req.body.email;
    var password = sha256(req.body.password);
    var username = req.body.username;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('INSERT INTO wanderland.user_account (username, email, password, first_name, last_name, gender, phone_num, city_id, country_id, date_of_birth, date_joined, description) VALUES (' +
            "'" + username + "'" +  ", '" + email + "'" + ", '" + password + "'" +', ' + "'" + first_name + "'" + ', '  + "'" + last_name + "'" +', '  + 'NULL, ' + ' NULL, ' +  'NULL'  + ', '  + 'NULL' +  ',NULL, ' +
            'NULL, ' + 'NULL' + ');', function(err){

            done();

            if (err) {
                res.send("Error " + err);
            }

            res.send("good");


        });
    });

});

router.post('/set_google', function(req, res){
    sess = req.session;
    sess.google = true;
    var email = req.body.email;
    console.log("got this from browser:   " + email);

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('select count(*) as count from wanderland.user_account where email = ' + "'" + email + "'", function(err, result){
            done();
            if (err) {
                res.send("Error " + err);
            }
            console.log("number of emails with this value:  " + result.rows[0].count);

            if (result.rows[0].count === 1) {
                console.log("redirected..");
                res.redirect("/");
            } else {
                sess.gemail = req.body.email;
                sess.gfirst_name = req.body.first_name;
                sess.glast_name = req.body.last_name;
                console.log("back to browser");
                res.send("goSign");
            }

        });
    });
});

router.get("/google_sign_up", function(req, res){
    sess = req.session;
    if (sess.google) {
        res.render("google_sign_up", {
            email: sess.gemail,
            first_name: sess.gfirst_name,
            google: true,
            last_name: sess.glast_name
        });
    } else {
        res.redirect("/");
    }

});
router.post('/signup', function(req, res){
    sess = req.session;
    if(sess.email){
        res.redirect("/");
    }
    var google, email, password, username, first_name, last_name;

    google = req.body.google;

    if (google) {
        first_name = req.body.first_name;
        last_name = req.body.last_name;
    } else {
        first_name = "";
        last_name = "";
    }

    email = req.body.emailNew;
    password = sha256(req.body.password);
    username = req.body.username;

    sess = req.session;
    console.log(email, password, username, first_name, last_name);

    if (validateEmail(email) && validateBlackList(password) && validateBlackList(username)) {
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query('SELECT * FROM wanderland.user_account WHERE user_account.email = ' +
                "'" + email + "'" +  ' OR user_account.username =' + "'" + username + "'" ,
                function(err, result) {
                    done();
                    if (err) {
                        console.error(err);
                        res.send("Error " + err);
                     } else {
                        if (result.rows.length === 2) {
                            req.checkBody("username", "Username already exists. Please choose another username.").usernameAvailable(JSON.stringify(result.rows[1]));
                            req.checkBody("username", "Special characters are not allowed in Username.").isValid();
                            req.checkBody("emailNew", 'Email already exists. Plese choose another email address.').doesExist(JSON.stringify(result.rows[0]));
                        } else {
                            req.checkBody("username", "Username already exists. Please choose another username.").usernameAvailable(JSON.stringify(result.rows[0]));
                            req.checkBody("username", "Special characters are not allowed in Username.").isValid();
                            req.checkBody("emailNew", 'Email already exists. Plese choose another email address.').doesExist(JSON.stringify(result.rows[0]));
                        }
                        var errors = req.validationErrors();
                        var mappedErrors = req.validationErrors(true);

                        if (errors) {
                                var errorMsgs = { "errors": {} };

                                errorMsgs.errors.status = "display: block";

                                if ( mappedErrors.username ) {
                                    errorMsgs.errors.error_username = mappedErrors.username.msg;
                                }

                                if ( mappedErrors.emailNew ) {
                                    errorMsgs.errors.error_emailNew = mappedErrors.emailNew.msg;
                                }
                                res.send("signup failed");
                            } else {
                                pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                                client.query('INSERT INTO wanderland.user_account (username, email, password, first_name, last_name, gender, phone_num, city_id, country_id, date_of_birth, date_joined, description) VALUES (' +
                                    "'" + username + "'" +  ", '" + email + "'" + ", '" + password + "'" +', ' + "'" + first_name + "'" + ', '  + "'" +  last_name  + "'"+ ', ' + 'NULL, ' + ' NULL, ' +  'NULL'  + ', '  + 'NULL' +  ',NULL, ' +
                                    'NULL, ' + 'NULL' + ');', function(err){

                                    done();

                                    if (err) {
                                        console.log("error from the database");
                                        res.send("Error " + err);

                                    }
                                    sess.email = email;
                                    if (!google) {
                                        res.send('done');
                                    } else{
                                        console.log("google value is :   " + google);
                                        res.redirect("/");
                                    }



                                });
                            });
                            }
                    }
            });
        });
    }

});

router.post('/file-upload', function(req, res){
    console.log('hi');
    sess = req.session;
    var userEmail = sess.email;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('select user_id from wanderland.user_account where email = ' + "'" + userEmail + "'", function(err, result){
            done();
            if (err) {
                res.send("Error " + err);
            }
            console.log(userEmail);
            var usrID = JSON.stringify(result.rows[0].user_id);

    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
       // console.log("Uploading: " + filename + "for the user:   " + usrID + "to the folder:  " + __dirname + '/../public/img/' + "profile_" + usrID);
        fstream = fs.createWriteStream('public/img/' + "profile_" + usrID);
        file.pipe(fstream);
        fstream.on('close', function () {

            res.redirect('/profile');

        });
    });

        });
    });
});


//router.post('/updatePassword', function(req, res){
router.post('/updatePassword', parseForm, csrfProtection, function(req, res){

    sess=req.session;
    var currPW = sha256(req.body.cpassword);
    var newPW = sha256(req.body.npassword);
    if (sess.email) {

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query('SELECT * FROM wanderland.user_account WHERE wanderland.user_account.email = ' +
                "'"+ sess.email + "'" +  ' AND wanderland.user_account.password =' + "'" + currPW + "'", function(err, result) {
                    done();
                    if (err) {
                        console.error(err);
                        res.send("Error " + err);
                    }
                    else {
                        req.checkBody("cpassword", "Wrong password entered. Password not updated.").isCorrectPW(JSON.stringify(result.rows[0]));

                        var errors = req.validationErrors();
                        var mappedErrors = req.validationErrors(true);

                        if (errors) {
                            var errorMsgs = { "errors": {} };

                            if ( mappedErrors.cpassword ) {
                                errorMsgs.errors.error_npw = mappedErrors.cpassword.msg;
                            }

                            pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                                        client.query('SELECT * FROM wanderland.user_account WHERE wanderland.user_account.email = ' +
                                            "'"+ sess.email + "'" , function(err, result) {
                                                done();
                                                if (err) {
                                                    res.send("Error " + err);
                                                 }
                                                else {
                                                    res.render('profile', {
                                                        results: result.rows,
                                                        errors: errorMsgs.errors,
                                                        type: 'other',
                                                        //csrfToken: req.csrfToken()
                                                    });

                                                }
                                            });
                                    });
                        } else {
                            pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                            client.query('UPDATE wanderland.user_account SET password = ' + "'" + newPW + "'" + 'WHERE user_account.email = ' +  "'"+ sess.email + "'" , function(err){
                                done();
                                if (err) {
                                    res.send("Error " + err);
                                } else {
                                    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                                        client.query('SELECT * FROM wanderland.user_account WHERE wanderland.user_account.email = ' +
                                            "'"+ sess.email + "'" , function(err, result) {
                                            done();
                                            if (err) {

                                                res.send("Error " + err);
                                            }
                                            else {
                                                res.render('profile', {
                                                    results: result.rows,
                                                    errors: '',
                                                    type: 'other',
                                                    //csrfToken: req.csrfToken()
                                                    });
                                            }
                                        });
                                    });
                                }
                            });
                        });
                        }
                    }
                });
        });
    }
});

router.post('/update_email', function(req, res){
    sess=req.session;
    var newEmail = req.body.newEmailValue;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM wanderland.user_account WHERE user_account.email = ' +
            "'" + newEmail + "'" , function(err, result) {
                done();
                if (err) {
                    console.error(err);
                    res.send("Error " + err);
                } else {
                        req.checkBody("newEmailValue", 'Email already exists. Plese choose another email address.').doesExist(JSON.stringify(result.rows[0]));

                        var errors = req.validationErrors();
                        var mappedErrors = req.validationErrors(true);

                        if (errors) {

                            var errorMsgs = { "errors": {} };

                            if ( mappedErrors.newEmailValue ) {
                                errorMsgs.errors.error_newEmailValue = mappedErrors.newEmailValue.msg;
                                update_handler.sendDefault(sess.email, errorMsgs.errors, req, res);
                            }
                        }  else {
                            update_handler.update_email(newEmail, sess, req, res);

                        }
                }
        });
    });
});

// Post page
router.get('/post/:postId', function(req, res){
    tool.get_info_by_post_id(req.params.postId, function(result){
        console.log('!B');
        if (result === 'error') {
          res.send('No such result in database');
        }
        else{
            glob('public/img/post_images/'+req.params.postId+'_*.*', function(er, files){
                console.log('!D');
                if (er) {
                    throw er;
                }
                // Format the file path
                for (var i = 0; i < files.length; i++) {
                    files[i] = files[i].replace('public', '..');
                }

                result.travel_start_date = tool.formatDate(result.travel_start_date);
                result.travel_end_date = tool.formatDate(result.travel_end_date);
                result.post_date = tool.formatDate(result.post_date);


                tool.get_result_suggestion(result.from_city, result.departure_country_id, result.to_city, result.destination_country_id, result.post_type, result.travel_start_date, result.travel_end_date, function(related_posts){

                    console.log('2: '+files);
                    res.render('post2', {
                        result: result,
                        images: files,
                        related_posts: related_posts
                        //csrfToken: req.csrfToken()
                    });

                });
            });
        }
    });

});


// Process create_post request
router.post('/create_post', function(req, res){
    console.log('create post');
    console.log(req.body);
    if (typeof sess === 'undefined' || typeof sess.email === 'undefined') {
        res.send('You need to sign in first');
        return;
    }
    // Image not required
    console.log("!A");

    if (req.body.title && req.body.description && req.body.from_city && req.body.to_city && req.body.post_type && req.body.from_date && req.body.to_date && req.body.way_of_travelling && req.body.travel_type) {
        var way_of_travelling = req.body.way_of_travelling;
        var description = req.body.description;
        var travel_type = req.body.travel_type;
        var title = req.body.title;
        var post_type = req.body.post_type;
        var post_date = new Date();
        post_date = tool.formatDate(post_date);
        var from_date = req.body.from_date;
        var to_date = req.body.to_date;
        var from_city = req.body.from_city.split(", ")[0];
        var from_country = req.body.from_city.split(", ")[1];
        var to_city = req.body.to_city.split(", ")[0];
        var to_country = req.body.to_city.split(", ")[1];
        if (typeof from_city === 'undefined' || typeof to_city === 'undefined' || typeof from_country === 'undefined' || typeof to_country === 'undefined') {
            res.send('Please enter city correctly');
        }
        else{
            // Find user id by email
            tool.get_user_id(sess.email, function(result0){
                var user_id = result0.user_id;
                // Get the city ids from city name and country name
                var from_city_id, to_city_id;
                tool.get_city_id(from_city, from_country, function(result1){
                    from_city_id = result1.city_id;

                    tool.get_city_id(to_city, to_country, function(result2){
                        to_city_id = result2.city_id;

                        tool.create_post(user_id, post_type, post_date, way_of_travelling, from_date, to_date, from_city_id, to_city_id, description, title, travel_type, function(result3){

                            if (result3 === 'error' || result1 === 'error' || result2 === 'error' || result0 === 'error') {
                                res.send('Error on creating post');

                            }else{
                                // result3.post_id
                                // res.redirect('/post/'+result3.post_id);

                                // res.send(JSON.stringify(result));
                                console.log('This is result object: ', result3);
                                // res.send('Your post_id is: '+result3.post_id);
                                // var fstream;
                                // req.pipe(req.busboy);
                                // req.busboy.on('file', function (fieldname, file, filename) {
                                //    // console.log("Uploading: " + filename + "for the user:   " + usrID + "to the folder:  " + __dirname + '/../public/img/' + "profile_" + usrID);
                                //     fstream = fs.createWriteStream('public/img/post_images/' + result3.post_id + "_1.jpg");
                                //     file.pipe(fstream);
                                //     fstream.on('close', function () {

                                //         res.redirect('/post/'+ result3.post_id);

                                //     });
                                // });
                                res.redirect('/post/'+ result3.post_id);


                            }
                        });

                    });

                });
            });
        }

    }
    else{
        res.send('Please fill out the whole form');
    }


});

router.get("/removeFriend/:username", function(req, res){
    var currUsr = sess.email;
    var usr = req.params.username;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('select user_id from wanderland.user_account where email = ' + "'" + currUsr + "'", function(err, result){
            done();
            if (err) {
                res.send("Error " + err);
            }
            var usrID = JSON.stringify(result.rows[0].user_id);

            pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                client.query('delete from wanderland.friendship where first_user_id =' + "'" + usrID + "'" + ' AND second_user_id =' + "'" + usr + "'", function(err){
                                done();
                        console.log('delete from wanderland.friendship where first_user_id =' + "'" + currUsr + "'" + ' AND second_user_id =' + "'" + usr + "'");

                        if (err) {
                            console.log("err");
                            res.send("Error " + err);
                        }
                        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                            client.query('delete from wanderland.friendship where first_user_id =' + "'" + usr + "'" + 'AND second_user_id =' + "'" + usrID + "'", function(err){
                            done();
                        if (err) {
                            res.send("Error " + err);
                        }
                    res.send("good");
                });

            });
        });
    });
        });
    });
});

router.get("/requestFriend/:username", function(req, res){
    var targetUser = req.params.username;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('select user_id from wanderland.user_account where username = ' + "'" + targetUser + "'", function(err, result){
            done();
            if (err) {
                res.send("Error " + err);
            }
            var usrID = JSON.stringify(result.rows[0].user_id);

            pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                client.query('INSERT into wanderland.request values (' + "'" + usrID + "'" + ', ' + "'" + sess.currId + "'" + ')', function(err){
                                done();
                        console.log('INSERT into wanderland.request values (' + "'" + usrID + "'" + ', ' + "'" + sess.currId + "'" + ')');

                        if (err) {
                            console.log("err");
                            res.send("Error " + err);
                        }
                    });
                });
        });
    });



    res.send(targetUser);
});

router.get("/declineRequests/:userID", function(req, res){
    var targetUser = req.params.userID;
    console.log(targetUser);

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query('delete from wanderland.request where to_user_id = ' + "'" + sess.currId + "'" + ' AND from_user_id =  ' + "'" + targetUser+ "'"  , function(err){
                done();
                console.log('delete from wanderland.request where to_user_id = ' + "'" + sess.currId + "'" + ' AND from_user_id =  ' + "'" + targetUser+ "'");
                if (err) {
                    res.send("Error " + err);
                }
        });
    });

    res.send(targetUser);
});


router.get("/getRequests/:username", function(req, res){

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                client.query('select username, user_id from wanderland.user_account where user_id in (select from_user_id from wanderland.request where to_user_id = ' + "'" + sess.currId + "'" + ')', function(err, result){
                    done();
                    if (err) {
                        res.send("Error " + err);
                    }

                    res.send(result.rows);
                });
            });

});

router.get("/makeFriends/:userId", function(req, res){
    var targetUser = req.params.userId;
    var currUser = sess.currId;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('INSERT into wanderland.friendship values (' + "'" + targetUser+ "'" + ', ' + "'" + currUser+ "'" + ')', function(err){

            done();
            if (err) {
                res.send("Error " + err);
            }

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query('INSERT into wanderland.friendship values (' + "'" + currUser + "'" + ', ' + "'" + targetUser+ "'" + ')' , function(err){
                done();
                if (err) {
                    res.send("Error " + err);
                }

                pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query('delete from wanderland.request where to_user_id = ' + "'" + currUser + "'" + ' AND from_user_id =  ' + "'" + targetUser+ "'"  , function(err){
                done();
                console.log('delete from wanderland.request where to_user_id = ' + "'" + currUser + "'" + ' AND from_user_id =  ' + "'" + targetUser+ "'");
                if (err) {
                    res.send("Error " + err);
                }





        });
    });





        });
    });



        });
    });

    res.send("you guys are buddies now!");

});


router.get("/getFriends/:username", function(req, res){
    var usr = req.params.username;
    var usrID;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('select user_id from wanderland.user_account where username = ' + "'" + usr + "'", function(err, result){
            done();
            if (err) {
                res.send("Error " + err);
            }

            usrID = JSON.stringify(result.rows[0].user_id);

            pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                client.query('select username, user_id from wanderland.user_account where user_id in (select second_user_id from wanderland.friendship where first_user_id = ' + "'" + usrID + "'" + ')', function(err, result){
                    done();
                    if (err) {
                        res.send("Error " + err);
                    }
                    console.log('select username from wanderland.user_account where user_id in (select second_user_id from friendship where first_user_id = ' + "'" + usrID + "'" + ')');
                    for (var i=0; i < result.rows.length; i++) {
                        var user = result.rows[i].user_id;
                        var path;
                        if (fs.existsSync('public/img/' + "profile_" + user)) {
                                path = '/img/' + "profile_" + user;
                            } else {
                                path = '/img/default_profile.jpg';
                            }

                        result.rows[i].pic = path;
                    }
                    res.send(result.rows);
                });
            });
        });
    });
});

router.post('/update_name', function(req, res){
    sess=req.session;
    var first_name = req.body.newNameFirst;
    var last_name = req.body.newNameLast;
    update_handler.update_name(first_name, last_name, sess.email, req, res);
});

router.post('/update_address', function(req, res){
    sess=req.session;
    var city = req.body.newCity;
    var country = req.body.newCountry;
    update_handler.update_address(city, country, sess.email, req, res);
});

router.post('/update_phone', function(req, res){
    sess=req.session;
    var phone_num = req.body.newPhone;

    update_handler.update_phone(phone_num, sess.email, req, res);
});

router.post('/update_dob', function(req, res){
    sess=req.session;
    var dob = req.body.newDOB;

    update_handler.update_dob(dob, sess.email, req, res);
});

router.post('/update_gender', function(req, res){
    sess=req.session;
    var gender = req.body.newGender;

    update_handler.update_gender(gender, sess.email, req, res);
});

router.post('/update_desc', function(req, res){
    sess=req.session;
    var desc = req.body.newDesc;

    update_handler.update_description(desc, sess.email, req, res);
});

router.get('/message', function(req, res) {
	sess = req.session;

	if (typeof sess === 'undefined' || typeof sess.email === 'undefined') {
        res.send('You need to sign in first');
        res.redirect('/');
    } else {
  	    res.render('message', {
            email: sess.email
        });
	}
});

module.exports = router;
