#!/usr/bin/env node

var Spooky = require('spooky');

//run hide my ass bot here
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
   spooky.start('http://www.palingram.com/ads-test.html');
	
	spooky.then(function () {
		this.fragmentA = 'https://4.hidemyass.com/ip-';
		this.fragmentB = '/encrypted/5YZRfV-Rs4staNsa5GY-GSYIdnH0ykZZWb9DdXaeTAeTWQmDQUm8&f=norefer';
		this.counter = 1;
		this.hhh = function(url){
			if(this.counter > 1){
				this.url = this.fragmentA+this.conter+this.fragmentB;
			}
			this.start(url);
			this.then(function () {
			   this.emit('hello', 'Hello, from ' + this.evaluate(function () {
					return document.title;
			   }));
			   phantom.clearCookies();
			   this.counter++;
			   this.hhh(this.url);
			});
		};
		this.hhh(this.fragmentA+this.conter+this.fragmentB); 
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

//restarts the app after every 500 visits and 20 minutes of app's uptime
var currentMin = 0;
setInterval(function(){
	currentMin++;
	if((counter>=500 && currentMin>30) || currentMin>30){
		 process.exit(0); 
	}
} , 60000);