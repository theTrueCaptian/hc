//Maeda Hanafi
//  server file: 
var username = "postgres";
var password = "****";

//var connectionString ="postgresql://"+username+":"+password+"@localhost:5432/hcdb" //|| "dbname=dbpsu0p5m1q0kt host=ec2-54-225-135-30.compute-1.amazonaws.com port=5432 user=qtplrjwwlajlru password=ReRrKSl0A8-mILhyUgJ43A8C8d sslmode=require";
//var authentication = require('./authentication.js'),
//	auth = new authentication.authentication(connectionString);

var express = require('express')
  , app = express()
  , port = process.env.PORT || 8000
  , verbose = true;

var fs=require('fs');
var htmlSource = fs.readFileSync("index.html", "utf8");
var  cheerio = require('cheerio');
	
function init(){

	//Routing*************************************************************************
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.session({ secret: 'SECRET' }));
	
	//authentication
	//auth.init(app);
	
	//app.all('/secure/admin/*', authentication.ensureAdmin);
	
	
	app.listen(port, function() {
	  console.log('Listening on:', port);
	});
	
	
	//app should send index.html to the user, when there is a connection
	/*app.get( '/', function( req, res ){
        console.log('trying to load %s', __dirname + '/index.html');
        //res.sendfile( '/index.html' , { root:__dirname });
		grabRSS(res);
    });
	app.get( '/index.html', function( req, res ){
        console.log('trying to load %s', __dirname + '/index.html');
		grabRSS(res);
    });*/
	
	//This handler will listen for requests on /*, any file from the root of our server.
    app.get( '/*' , function( req, res, next ) {

        //This is the current file they have requested
        var file = req.params[0];

        //For debugging, we can track what files are requested.
        if(verbose) console.log('\t :: Express :: file requested : ' + file);

        if(file == 'index.html'){
			grabRSS(res);
        }else{
        	//Send the requesting client the file.
        	res.sendfile( __dirname + '/' + file );
        }
        

    });
	
	
	
 };
 

 

 
 function grabRSS(res){
	
	var feed = [
		"http://blog.dianpelangi.com/feeds/posts/default?alt=rss", 
		//"http://hijaberscommunity.blogspot.com/feeds/posts/default", 
		//"http://sitisstreet.blogspot.com/feeds/posts/default", 
		//"http://saturday-market.blogspot.com/"
		//"http://hanatajima.tumblr.com/rss"
		];
	htmlSource = fs.readFileSync("index.html", "utf8");
	
	$ = cheerio.load(htmlSource);
	
	var flag = false;
	for( i=0; i<feed.length; i++){	
		if(i==feed.length-1) flag = true;
		grabByURL(feed[i], res, flag);
	}
	
 };
 //URL, res for editing index file, last to idicate its the last one to scan
 function grabByURL(URL, res, last){
	var FeedParser = require("feedparser");
	var request = require('request');
	var json2html = require('node-json2html');
 
	var transform = {'tag':'p','html':'${title} (${author}) (${summary}) (${description})'};
   	 

	request(URL)
			.pipe(new FeedParser())
			.on('error', function (error) {
				console.error(error);
			})
			.on('meta', function (meta) {
				console.log('===== %s =====', meta.title);
				
			})
			.on('readable', function() {
				var stream = this, item;
					
				while (item = stream.read()) {
					console.log('Got article: %s', item.title || item.description);
					
					
					//console.log(JSON.stringify(item));
					$('#content').append("<p>"+json2html.transform(JSON.stringify(item),transform) );
					
				}
				if(last){	//only send on the last one
					//stream.on('end', function() {
						//htmlSource = $.html();
						//console.log("END",URL, res, last)
						//console.log(res.finished)
						//res.send( htmlSource );

						//console.log($.html());
						//console.log('there will be no more data.');
					  
					//});
				};
				
				
			}).on('end', function(){
				//if(last){	//only send on the last one

					htmlSource = $.html();
					res.send( htmlSource );

					//console.log($.html());
					//console.log('there will be no more data.');
				//}
			});
		
		
 };
 init();



