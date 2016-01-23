#!/usr/bin/env node

var express = require("express");
var app = express();
var Spooky = require('spooky');

var gGreeting = 'Hello World';
var counter = 0;

 
// adopted from Heroku's [Getting Started][] and [Spooky][]'s sample
// [Getting Started]: https://devcenter.heroku.com/articles/getting-started-with-nodejs
// [Spooky]: https://github.com/WaterfallEngineering/SpookyJS
//[Heroku APP_NAME here]
//ghost job to visit zapchain's posts.

var spooky = new Spooky({
        child: {
            transport: 'http'
			//proxy: '192.128.101.42:9001'
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
       spooky.start('http://www.palingram.com/ads-test.html');
		
		spooky.then(function () {
			this.urls = [
			   'http://www.palingram.com/ads-test.html',
			   'http://www.palingram.com/ads-test.html',
			   'http://www.palingram.com/ads-test.html',
			   'http://www.palingram.com/ads-test.html',
			   'https://www.zapchain.com/a/l/the-economics-behind-bitcoin-mining-centralization/2lxJRd8lh0'
			   //'https://www.zapchain.com/a/l/for-a-world-in-gloom-a-new-torchbearer/lW0XBjDjqV',
			   //'https://www.zapchain.com/a/l/why-you-should-adopt-bitcoin/LU2E5YAEoY'
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
					   if(url.indexOf('crd.ht')>-1){
						   this.click('[value=cr]');
						   this.then(function(){
							    this.emit('hello', 'Hello, from ' + this.evaluate(function () {
									return document.title;
							   }));
							   this.hhh(this.urls[this.counter%this.urlSize]);
						   });
					   }
					   else{
						   this.hhh(this.urls[this.counter%this.urlSize]);
					   }
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


//app.use(express.logger());
app.get('/', function(request, response) {
    response.send(gGreeting+" visited "+counter+" times");
});

//restarts the app after every 500 visits and 20 minutes of app's uptime
var currentMin = 0;
setInterval(function(){
	currentMin++;
	if((counter>=500 && currentMin>20) || currentMin>20){
		 process.exit(0); 
	}
} , 60000);

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});