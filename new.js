
var express = require('express');
var session = require('express-session');
var pg = require('pg');
var update_handler = require("./handle_update.js");
var expressValidator = require('express-validator');

var router = express.Router();
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


    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM wanderland.user_account WHERE wanderland.user_account.email = ' +
            "'"+ req.body.email + "'" +  ' AND wanderland.user_account.password =' + "'" +
            req.body.pass + "'" , function(err, result) {
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
                        sess.email = req.body.email;
                        sess.pass = req.body.pass;
                        res.end('done');
                    }
                }
            });
        });
});



var tool = require('./public/db_function');
var glob = require('glob');


router.get('/', function(req, res) {
    sess = req.session;

    if (sess.email) {
        res.redirect('/profile');
    } else {
        if (!sess.error_msg) {
            sess.error_msg = '';
            res.render('index', {errors: sess.error_msg});
        } else {
            res.render('index', {errors: sess.error_msg.errors});
        }
    }
});

router.post('/result', function(req, res) {
    if (typeof req.body.from_date === "undefined") {
        res.send('No req.body');
    }
    else{
        var from_date = req.body.from_date.replace('/', '-');
        var to_date = req.body.to_date.replace('/', '-');
        console.log(req.body);
        res.send(req.body);
        tool.get_result(req.body.post_type, from_date, to_date, req.body.from_city, req.body.to_city, function(result){
            res.send(JSON.stringify(result));
        })
        // res.send(req.body.from_date);
    }
    // res.render('result', { title: 'result', message: 'results'});
});

router.get('/admin_manage', function(req, res) {
    res.render('admin_manage', { title: 'admin_manage', message: 'adminManage'});
});

router.get('/admin', function(req, res) {
    sess = req.session;

    if (sess.email) {
        res.redirect('/profile');
    } else {
        if (!sess.error_msg) {
            sess.error_msg = '';
            res.render('admin', {errors: sess.error_msg});
        } else {
            res.render('admin', {errors: sess.error_msg.errors});
        }
    }
});

router.get('/profile', function(req, res){
    sess=req.session;

    if (sess.email){

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
                        errors: ' ',
                        type: 'own'
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
    targetUser= req.params.username;

    //console.log(targetUser);

    //res.send(targetUser);

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM wanderland.user_account WHERE wanderland.user_account.username = ' +
            "'"+ targetUser + "'" , function(err, result) {
            done();
            if (err) {
                res.send("Error " + err);
             }
            else {
               //console.log(JSON.stringify(result.rows[0]));
                //res.render('profile', {
                    //results: result.rows,
                    //errors: ' '
               // });
               //res.redirect('/')
               sess.targetUser = result.rows[0].email;
               console.log("hahahah" + sess.targetUser);
               res.send("good");
            }
        });
    });


        //res.redirect('/');

});

router.get('/showusr', function(req, res){

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query('SELECT * FROM wanderland.user_account WHERE wanderland.user_account.email = ' +
                "'"+ sess.targetUser + "'" , function(err, result) {
                done();
                if (err) {
                    res.send("Error " + err);
                 }
                else {
                    res.render('profile', {
                        results: result.rows,
                        errors: ' ',
                        type: 'own'
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
    var password = req.body.password;
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

router.post('/updatePassword', function(req, res){
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
                                                    res.render('profile', {results: result.rows, errors: errorMsgs.errors, type: 'other'});

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
                                                    type: 'other'
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
    var username, type, post_date, way_of_travelling, travel_start_date, travel_end_date;

    tool.get_info_by_post_id(req.params.postId, function(result){
        if (result === 'error') {
          res.send('No such result in database');
        } else{
            glob('public/assets/images/post_images/'+req.params.postId+'_*.jpg', function(er, files){
                if (er) throw er;
                // Format the file path
                for (var i = 0; i < files.length; i++) {
                    console.log('looped');
                    files[i] = files[i].replace('public', '..');
                };
                console.log('2: '+files);
                res.render('post2', {result: result, images: files});
            })
        }
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
