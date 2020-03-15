//Maeda Hanafi
//server version of a flying shape object
//MAKE AUTHENTICATION WORK done
//FIX THE DESI+ERIALIZATION?SERIALIZATION done
//MAKE ADMIN.JS connect propoerly to ADMIN.html(work together)
//THEN WORK ON ADDING BLOG POSTS WHICH AUTOMATICALLY LOADS EACH POST INTO DATABASE; MAKE SURE DUPLICATES DON"T EXIST
//THEN WORK ON MAKING A SCRIPT THAT WOULD SCAN RSS FEEDS CONTINUOUSLY FOR UPDATES
var adminStatus = false;
	
var authentication = function(inConnectionString){
	var passport = require('passport')
	  , LocalStrategy = require('passport-local').Strategy
	  , bcrypt = require('bcrypt-nodejs')
	  , SALT_WORK_FACTOR = 10
	  , flash = require('connect-flash');
	var connectionString = inConnectionString;
	var redirects = { successRedirect: '/index.html',
									   failureRedirect: '/signin.html',
									   failureFlash: true };
	var conn;
	
	//only used when an admin is logged in
	var adminName = 'admin';
	var admin ;
	
	var init = function(app){
		
		app.use(passport.initialize());
		app.use(passport.session());
		app.use(flash());
		app.post('/login',	passport.authenticate('local', redirects));
	
		//Database **************************************************************************
		var db = require('./database').database;

		conn = new db(connectionString);
		conn.databaseConnect();
		
		
		//authentication************************************************************************		
		passport.use(new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password'
			},
			function(usernameField, passwordField, done) {
				console.log("pasport local strategy");
				if(usernameField==adminName){
					findPasswordByUsername(usernameField, passwordField,
						function(err, result){
							console.log(""+err);
				
							if(result.rowCount==1){
								var firstRow = result.rows[0];
								for(var columnName in firstRow) {
									console.log('column "%s" has a value of "%j"', columnName, firstRow[columnName]);
								  }
								var user = result.rows[0];//JSON.stringify(result.rows[0]);//{id: result[0].USER_ID, type: result[0].USER_TYPE_ID, email: result[0].EMAIL, username: result[0].USERNAME};
								console.log('logging in the admin:'+user);
							
								adminStatus = true;
								var impadmin = require('./admin.js').admin;
								admin = new impadmin();
								return done(null, user);
							};
							return done(null, false, { message: 'Wrong credentials ' });
						}
					);
				
			  }
			}
		));
		//set the user to req.user and establish a session via a cookie set in the user’s browser
		passport.serializeUser(function(user, done) {
			console.log('serializing and storing session info:'+ user["USER_ID"]);
						
			done(null, user["USER_ID"]);
		});

		passport.deserializeUser(function(id, done) {
			console.log('working on deserializin:d'+id);
			
			findUserByUserId(id, function(err, result){
				console.log(""+err);
				
				if(result.rowCount==1){
					
					var user = result.rows[0];//{id: result[0]["USER_ID"], type: result[0]["USER_TYPE_ID"], email: result[0]["EMAIL"], username: result[0]["USERNAME"]};
					console.log('desserializing info:'+ JSON.stringify(user));
			
					done(null, user);
				}else{
					console.log('da heck nothing was found');
			
				}
			});
			
			
		});
	};
	
	function findUser(email, password){
 
	};
	
	function findUserByUserId(userid, callback){
		var query = conn.query("SELECT * FROM \"Users\" WHERE \"USER_ID\"="+userid+";", callback);
			
		return query;
		
		
	};
	
	function findPasswordByUsername(user, password, callback){
		
		var query = conn.query("SELECT * FROM \"Users\" WHERE \"USERNAME\"=\'"+user+"\' AND \"PASSWORD\"=\'"+password+"\';", callback);
		
		return query;
		
		
	};

	return  {
		init:init
		}
};
//allow others to access this file
exports.authentication = authentication;


// Simple route middleware to ensure user is authenticated.  Otherwise send to login page.
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
};
 
// Check for admin middleware, this is unrelated to passport.js
// You can delete this if you use different method to check for admins or don't need admins
exports.ensureAdmin = function ensureAdmin(req, res, next) {
        if(adminStatus === true){
			console.log("ADMIN STATUS ACHEIVED");
						
            next();
        }else{
		console.log("ADMIN STATUS NOT ACHEIVED");
			
            res.send(403);
		}
};