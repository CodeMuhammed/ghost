#!/usr/bin/env node

var express = require("express");
var app = express();
var Spooky = require('spooky');

// adoped from Heroku's [Getting Started][] and [Spooky][]'s sample
// [Getting Started]: https://devcenter.heroku.com/articles/getting-started-with-nodejs
// [Spooky]: https://github.com/WaterfallEngineering/SpookyJS


//**************** GHOST MODE***************************
var counter = 0;
var gGreeting = 'Hello World';

function creep() {
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

			spooky.start(
				'http://www.palingram.com/ads-test.html');
			spooky.then(function () {
				this.emit('hello', 'Hello, from ' + this.evaluate(function () {
					return document.title;
				}));
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
		gGreeting = greeting;
		counter++;
		creep();
	});

	spooky.on('log', function (log) {
		if (log.space === 'remote') {
			console.log(log.message.replace(/ \- .*/, ''));
		}
	});
}
creep();
//******************************************************



app.use(express.logger());
app.get('/', function(request, response) {
    response.send(gGreeting+" "+counter+" times");
});

var port = process.env.PORT || 3001;
app.listen(port, function() {
    console.log("Listening on " + port);
});