
var express = require('express');
var session = require('express-session');
var pg = require('pg');
var fs = require('fs');
var update_handler = require("./models/handle_update.js");
var busboy = require('connect-busboy');
var expressValidator = require('express-validator');
var sha256 = require('js-sha256');

var router = express.Router();

// Security
var csrf = require('csurf');
var cookieParser = require('cookie-parser');
var sanitizer = require('sanitizer');
var bodyParser = require('body-parser');

var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });

router.use(cookieParser());

var sess;

router.use(session({secret: 'shhhhh',
                    resave: true,
                    saveUninitialized: false,
                    cookie: {maxAge: 50000}
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

router.post('/login', function(req, res){
    sess = req.session;
    var email = req.body.email;
    var password = req.body.pass;

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
                        res.end('done');
                    }
                }
            });
        });
});

var tool = require('./models/db_function');
var glob = require('glob');

router.get('/', csrfProtection, function(req, res) {
    sess = req.session;

    if (sess.email) {
        res.redirect('/profile');
    } else {
        if (!sess.error_msg) {
            sess.error_msg = '';
            res.render('index', {
                errors: sess.error_msg,
                csrfToken: req.csrfToken()
            });
        } else {
            res.render('index', {
                errors: sess.error_msg.errors,
                csrfToken: req.csrfToken()
            });
        }
    }
});

router.post('/result', csrfProtection, function(req, res) {
    console.log(req.body);
    console.log('Type: '+ typeof req.body.from_date + ' '+ typeof req.body.to_date + ' ' + typeof req.body.from_city + ' ' + typeof req.body.to_city);
    if (typeof req.body.from_date === "undefined" || typeof req.body.to_date === "undefined" || typeof req.body.from_city === "undefined" || typeof req.body.to_city === "undefined" || req.body.to_date === 'what day' || req.body.from_date === 'what day' || req.body.from_city === 'what city' || req.body.to_city === 'what city') {
        res.send('No req.body');
    }
    else{
        var from_date = req.body.from_date;
        var to_date = req.body.to_date;
        var from_city = req.body.from_city.split(", ")[0];
        var from_country = req.body.from_city.split(", ")[1];
        var to_city = req.body.to_city.split(", ")[0];
        var to_country = req.body.to_city.split(", ")[1];
        console.log("Type2: "+ typeof from_city + ' '+typeof to_city_id + ' '+typeof from_country + ' '+ typeof to_country);
        if (typeof from_city === 'undefined' || typeof to_city === 'undefined' || typeof from_country === 'undefined' || typeof to_country === 'undefined') {
            res.send('Please enter both city and country name');
        }
        else{
            // Get the city ids from city name and country name
            var from_city_id, to_city_id;
            tool.get_city_id(from_city, from_country, function(result1){
                from_city_id = result1.city_id;

                tool.get_city_id(to_city, to_country, function(result2){
                    to_city_id = result2.city_id;

                    tool.get_result(req.body.post_type, from_date, to_date, from_city_id, to_city_id, function(result3){

                        if (result3 === 'error' || result1 === 'error' || result2 === 'error') {
                            res.send('No matching result');

                        }else{
                            // res.send(JSON.stringify(result));
                            console.log('This is result object: ', result3);
                            res.render("result", {
                                result: result3,
                                csrfToken: req.csrfToken()
                            });
                        }
                    });

                });

            });
        }
    }
    // res.render('result', { title: 'result', message: 'results'});
});

router.get('/get_city', function(req, res){
    tool.get_city(req.query.key, function(result){
        if (result === 'error') {
            res.send('No matching result');
        }
        else{
            res.send(JSON.stringify(result));
        }
    });

});

router.get('/admin-manage', csrfProtection, function(req, res) {
    res.render('admin-manage', {
        title: 'admin_manage',
        message: 'adminManage',
        csrfToken: req.csrfToken()
    });
});

router.post('/enter-data', function(req, res) {
    var country = req.body.country;
    var city = req.body.city;
    var country_code = req.body.country_code;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('INSERT INTO wanderland.country VALUES (' + 'default' + ',' +
            "'" + country_code + "'" + ',' + "'" + country + "'" +
            ');', function(err, result){
                done();
                if (err) {
                    res.send("Error " + err);
                    // change the erro message later
                }
                res.redirect('/admin-manage');
                });
    });
});

router.get('/admin', csrfProtection, function(req, res) {
    sess = req.session;

    if (sess.email) {
        res.redirect('/profile');
    } else {
        if (!sess.error_msg) {
            sess.error_msg = '';
            res.render('admin', {
                errors: sess.error_msg,
                csrfToken: req.csrfToken()});
        } else {
            res.render('admin', {
                errors: sess.error_msg.errors,
                csrfToken: req.csrfToken()});
        }
    }
});

router.get('/profile', csrfProtection, function(req, res){
    sess=req.session;
    var userEmail;

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
                            if (fs.existsSync(__dirname + '/public/img/' + "profile_" + usrID + ".jpg")) {
                                path = '/img/' + "profile_" + usrID + ".jpg";
                            } else {
                                path = '/img/default_profile.jpg';
                            }
                            res.render('profile', {
                                results: result1.rows,
                                csrfToken: req.csrfToken(),
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

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM wanderland.user_account WHERE wanderland.user_account.username = ' +
            "'"+ targetUser + "'" , function(err, result) {
            done();
            if (err) {
                res.send("Error " + err);
             }
            else {
               sess.targetUser = result.rows[0].email;
               res.send("good");
            }
        });
    });

});

router.get('/showusr', csrfProtection, function(req, res){
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
                            if (fs.existsSync(__dirname + '/public/img/' + "profile_" + usrID + ".jpg")) {
                                path = '/img/' + "profile_" + usrID + ".jpg";
                            } else {
                                path = '/img/default_profile.jpg';
                            }
                            res.render('viewusr', {
                                results: result1.rows,
                                errors: ' ',
                                type: sess.email,
                                pic: path,
                                csrfToken: req.csrfToken()

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

router.post('/signup', function(req, res){

    var account = req.body.emailNew;
    var password = sha256(req.body.password);
    var username = req.body.username;

    sess = req.session;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM wanderland.user_account WHERE user_account.email = ' +
            "'" + account + "'" +  ' OR user_account.username =' + "'" + username + "'" ,
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
                                "'" + username + "'" +  ", '" + account + "'" + ", '" + password + "'" +', ' + 'NULL' + ', '  + 'NULL, '  + 'NULL, ' + ' NULL, ' +  'NULL'  + ', '  + 'NULL' +  ',NULL, ' +
                                'NULL, ' + 'NULL' + ');', function(err, result){

                                done();

                                if (err) {
                                    res.send("Error " + err);
                                }
                                sess.email = account;
                                res.send('done');


                            });
                        });
                        }
                }
        });
    });
});

router.post('/file-upload', function(req, res, next){
    var userEmail = sess.email;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('select user_id from wanderland.user_account where email = ' + "'" + userEmail + "'", function(err, result){
            done();
            if (err) {
                res.send("Error " + err);
            }

            var usrID = JSON.stringify(result.rows[0].user_id);

    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        fstream = fs.createWriteStream(__dirname + '/public/img/' + "profile_" + usrID + ".jpg");
        file.pipe(fstream);
        fstream.on('close', function () {

            res.redirect('/profile');
            //res.send(__dirname + '/public/assets/images/profile_images/' + "profile_" + usrID + ".jpg");
        });
    });

        });
    });
});

router.post('/updatePassword', csrfProtection, function(req, res){
    sess=req.session;
    var currPW = req.body.cpassword;
    var newPW = req.body.npassword;
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
                                                        csrfToken: req.csrfToken()
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
                                                    csrfToken: req.csrfToken()
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
router.get('/post/:postId', csrfProtection, function(req, res){
    var username, type, post_date, way_of_travelling, travel_start_date, travel_end_date;

    tool.get_info_by_post_id(req.params.postId, function(result){
        if (result === 'error') {
          res.send('No such result in database');
        } else{
            glob('public/img/post_images'+req.params.postId+'_*.jpg', function(er, files){
                if (er) {
                    throw er;
                }
                // Format the file path
                for (var i = 0; i < files.length; i++) {
                    console.log('looped');
                    files[i] = files[i].replace('public', '..');
                }
                console.log('2: '+files);
                res.render('post2', {
                    result: result,
                    images: files,
                    csrfToken: req.csrfToken()
                });
            });
        }
    });

});
// Create post form
router.get('/create_post', csrfProtection, function(req, res){

    if (typeof sess.email === 'undefined' || typeof sess === 'undefined') {
        res.send('You need to sign in first');
    }else{
        res.render('create_post');
        // res.send(sess.email);
    }

// Process create_post request
router.post('/create_post', function(req, res){



});

});
router.get("/removeFriend/:username", function(req, res){
    var currUsr = sess.email;
    var usr = req.params.username;
    //res.send(currUsr + " " + usr);

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('select user_id from wanderland.user_account where email = ' + "'" + currUsr + "'", function(err, result){
            done();
            if (err) {
                res.send("Error " + err);
            }
            var usrID = JSON.stringify(result.rows[0].user_id);

            pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                client.query('delete from wanderland.friendship where first_user_id =' + "'" + usrID + "'" + ' AND second_user_id =' + "'" + usr + "'", function(err, result){
                                done();
                        console.log('delete from wanderland.friendship where first_user_id =' + "'" + currUsr + "'" + ' AND second_user_id =' + "'" + usr + "'");

                        if (err) {
                            console.log("err");
                            res.send("Error " + err);
                        }
                        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                            client.query('delete from wanderland.friendship where first_user_id =' + "'" + usr + "'" + 'AND second_user_id =' + "'" + usrID + "'", function(err, result){
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
                        if (fs.existsSync(__dirname + '/public/img/' + "profile_" + user + ".jpg")) {
                                path = '/img/' + "profile_" + user + ".jpg";
                            } else {
                                path = '/img/default_profile.jpg';
                            }

                        result.rows[i].pic = path;
                        console.log(result.rows[i].pic);
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

module.exports = router;
