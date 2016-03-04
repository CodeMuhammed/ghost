#!/usr/bin/env node

var request = require('request');
var express = require("express");
var app = express();
var path = require('path');
var Spooky = require('spooky');
var LineByLineReader = require('line-by-line');

//run main non ip address changing bot
var gGreeting = 'Hello World';
var counter = 0;
var ghostIpUrls = [];
var urls = [
   'http://www.palingram.com/ads-test.html',
   /*'http://fg20.herokuapp.com',
   'http://fg20.herokuapp.com',
   'http://fg20.herokuapp.com',
   'http://fg20.herokuapp.com',
   'http://fg20.herokuapp.com',
   'http://fg20.herokuapp.com',
   'http://fg20.herokuapp.com',
   'http://fg20.herokuapp.com',
   'http://fg20.herokuapp.com',*/
   'http://www.linkbucks.com/fk8Y',
];
var runGhostWhite;

//
function pingGhostIp(cb){
	//
    console.log('heroku ping here');
    //Read lines of ip use them to make request before resulting to gimmeproxy
	ha = new LineByLineReader('ghostipapps.txt');
	ha.on('error', function (err) {
		console.log('error while reading file');
	});

	ha.on('line', function (line) {
		ghostIpUrls.push(line.toString());
	});

	ha.on('end', function () {
	   console.log(ghostIpUrls.length);
	   
	   //do pinging
	   var currentUrl = 0;
	   function doPing(){
	       if(currentUrl < ghostIpUrls.length){
		        request.get(ghostIpUrls[currentUrl] , function(err , response , body){
					 if(err){
						 console.log(err);
						 currentUrl++;					 
						 doPing();
					 } 
					 else {
					     Greeting = ghostIpUrls[currentUrl]+' test done';
						 console.log(ghostIpUrls[currentUrl]+' test done'); 
						 currentUrl++;					 
						 doPing();
					 }
				 });
		   }
		   else{
			  cb();
		      return;
		   }  
	   };
	   
	   doPing();
	});
};
//initial pinging of ghostip
pingGhostIp(function(){
	console.log('Initial pinging done');
	Greeting = 'Initial pinging done';
	initSpooky();
});

function initSpooky(){
	var spooky = new Spooky({
        child: {
            transport: 'http'
        },
        casper: {
            logLevel: 'debug',
            verbose: true
        }
    }, function (err) {
        if (err) {
            e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }
		
		runGhostWhite = function(){
			spooky.start(urls[counter%urls.length]);
			spooky.then(function(){
				this.wait(30000 , function(){
					this.emit('hello' , this.evaluate(function () {
						return document.title;
				   }));
				});
			});
		}
        runGhostWhite();
		
        spooky.run();
    });
	
	spooky.on('error', function (e, stack) {
		console.error('this '+e);
		if (stack) {
			console.log('this here '+stack);
		}
		counter++;
		gGreeting = e;
		runGhostWhite();
	});

	spooky.on('hello', function (greeting) {
		console.log(greeting);
		counter++;
		gGreeting = greeting;
		runGhostWhite();
	});
	
	spooky.on('console', function (line) {
		console.log(line);
	});
}

//
//
app.use(express.static(path.join(__dirname , 'public')));

app.get('/stats', function(request, response) {
    response.send(gGreeting+" visited "+counter+" times ");
});

//restarts the app after every 500 visits and 20 minutes of app's uptime
setTimeout(function(){
	//initial pinging of ghostip
	pingGhostIp(function(){
		process.exit(0);
	});
} , 60000*60);

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});