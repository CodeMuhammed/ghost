var Spooky = require('spooky');

var spooky = new Spooky({
  casper: {
   logLevel: 'error',
   verbose: false,
   options: {
     clientScripts: ['http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js']
   }
 }
}, function (err) {
  // NODE CONTEXT
  console.log('We in the Node context');
  spooky.start('https://crd.ht/7sWNFi6');
  spooky.then(function() {
    // CASPERJS CONTEXT
      console.log('We in the CasperJS context');
      this.emit('consoleWe can also emit events here.');
      this.click('div.unselectable');
  });
   spooky.then(function() {
		// CASPERJS CONTEXT
		var size = this.evaluate(function() {
		// PAGE CONTEXT
		console.log('....'); // DOES NOT GET PRINTED OUT
		__utils__.echo('We in the Page context'); // Gets printed out
		this.capture('screenshot.png');
		var $selectsize = $('div').click();
		return $selectsize;
		})
	  });
  
});