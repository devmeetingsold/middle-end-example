var http = require('http'),
	jsdom = require('jsdom'),
	async = require('async'),
	fs = require('fs'),
	html_template = fs.readFileSync('html/index.html').toString('utf8');


http.createServer(function (req, res) {
	if (req.url === '/favicon.ico') {
		res.end();
		return;
	}
	res.writeHead(200, { 'Content-Type': 'text/html' });

	jsdom.env(html_template, function (errors, window) {
		async.parallel([
			function (callback) {
				httpGET(
					'localhost',
					'/devcamp/integration/me/dummy-model.js',
					function (data) {
						callback(null, data);
					}
				);
			},
			function (callback) {
				httpGET(
					'localhost',
					'/devcamp/integration/me/lib-client/flights.js',
					function (data) {
						callback(null, data);
					}
				);
			}
		],
		function () {
			console.log(arguments);
		});


		res.write(window.document.doctype.toString());
		res.write(window.document.innerHTML);
		res.end();
	});

}).listen(1337, "127.0.0.1");
console.log('Server running at http://127.0.0.1:1337/');

var httpGET = function (host, path, on_end) {
	http.get({
		host: host,
		path: path,
		port: 80
	},
	function (res) {
		var data = '';
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function () {
			on_end(data);
		});
	});
};
