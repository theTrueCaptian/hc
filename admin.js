//Maeda Hanafi
//server version of a flying shape object

var admin = function( ){
	 
	
	 

	return  {
		 
		}
};
//allow others to access this file
exports.admin = admin;




/*
var connectionString = process.env.DATABASE_URL 
var express = require('express')
  , app = express()
  , port = process.env.PORT || 8000
  , verbose = false;

  
var fs=require('fs');
var htmlSource = fs.readFileSync("index.html", "utf8");
var  cheerio = require('cheerio');

 function init(){
 
	app.listen(port, function() {
	  console.log('Listening on:', port);
	});
	
	//app should send index.html to the user, when there is a connection
	app.get( '/', function( req, res ){
		console.log('trying to load %s', __dirname + '/admin.html');
		//res.sendfile( '/admin.html' , { root:__dirname });
		grabURLs(res);
	});
	
	//This handler will listen for requests on /*, any file from the root of our server.
	app.get( '/*' , function( req, res, next ) {

		//This is the current file they have requested
		var file = req.params[0];
		//For debugging, we can track what files are requested.
		if(verbose) console.log('\t :: Express :: file requested : ' + file);
		//Send the requesting client the file.
		res.sendfile( __dirname + '/' + file );

	});
	
	
 };
  
  function grabURLs(res){
		htmlSource = fs.readFileSync("admin.html", "utf8");	
		$ = cheerio.load(htmlSource);
		var db = require('./database').database;
		var conn = new db(connectionString);
		conn.databaseConnect();

		conn.getBlogLinks(res, $, htmlSource);
	
  };
 init();*/