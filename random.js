var curl = require('curlrequest');


var curlGet = function(url, proxy, callback) {
	var options = {
		url: url,
		retries: 5,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
		},
		timeout: 15,
	};
	
	if(proxy) {
		options.proxy = proxy;
	}

	curl.request(options, function(err, res) {
		if(callback) callback(err, res);
	});
}

var getPage = function(url, callback) {
	curlGet('http://gimmeproxy.com/api/get/8bb99df808d75d71ee1bdd9e5d/?timeout=1', null, function(err, json) { // get new proxy
		
		var data = JSON.parse(json), proxy = null;
		if(!data || data.error) {
			console.log('Error:', data);
		} else {
			proxy = data.curl;
			console.log('Set proxy', proxy);
		}
		curlGet(url, proxy, callback);
	});
}

var test = function(i) {
	getPage('http://icanhazip.com/', function(err, res) {
		console.log(res);
		i++;
		if(i < 5) test(i);
	});
}

test(0);