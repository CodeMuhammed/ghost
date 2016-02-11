#!/usr/bin/env node

var request = require('request');
var express = require("express");
var app = express();
var path = require('path');
var Spooky = require('spooky');



//run main non ip address changing bot
var gGreeting = 'Hello World';
var counter = 0;
console.log(gGreeting);

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
		console.log('here here');
        spooky.start('http://www.palingram.com/ads-test.html');
		
		spooky.then(function () {
			this.urls = [
			   'http://www.upbunk.com/ads-test.html',
			   'http://www.palingram.com/ads-test.html',
			   'http://adf.ly/1WlnRG'
			];
			this.counter = 0;
            this.urlSize = this.urls.length;
			this.hhh = function(url){
				this.start(url);
				this.then(function () {
				   this.emit('hello', 'Hello, from ' + this.evaluate(function () {
						return document.title;
				   }));
				   phantom.clearCookies();
				   this.counter++;
				   this.wait(10 , function(){
					   this.hhh(this.urls[this.counter%this.urlSize]);
				   });
				});
			};
			this.hhh(this.urls[this.counter%this.urlSize]); 
		});
		
        spooky.run();
    });

spooky.on('error', function (e, stack) {
    console.error(e);

    if (stack) {
        console.log(stack);
    }
});

/*
// Uncomment this block to see all of the things Casper has to say.
// There are a lot.
// He has opinions.
spooky.on('console', function (line) {
    console.log(line);
});
*/

spooky.on('hello', function (greeting) {
    console.log(greeting);
	counter++;
    gGreeting = greeting;
});

spooky.on('log', function (log) {
    if (log.space === 'remote') {
        console.log(log.message.replace(/ \- .*/, ''));
    }
});

//run ip changing credhot visiting bot
//var ipful = require('./ipful');
//ipful.init();

//app.use(express.logger());
app.get('/', function(request, response) {
    response.send(gGreeting+" visited "+counter+" times ");
});

//
app.use(express.static(path.join(__dirname , 'public')));

//restarts the app after every 500 visits and 20 minutes of app's uptime
var currentMin = 0;
setInterval(function(){
	currentMin++;
	if((counter>=500 && currentMin>30) || currentMin>30){
	 request.get('https://ghostip.herokuapp.com', function(err , response , body){
			 if(err){
				process.exit(0); 
			 } 
			 else {
				process.exit(0); 
			 }
		 });
		 
	}
} , 120000);

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});