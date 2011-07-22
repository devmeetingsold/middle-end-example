var http = require('http');
var static = require('node-static');
var util = require('util');
var eventEmitter = require('events').EventEmitter;

var staticFiles = [];

function isStatic(url) {
	extIndex = url.lastIndexOf('.') + 1;
	return staticFiles.indexOf(url.substr(extIndex)) > -1;
}

// {host: 'localhost', port : 8080, files : ['', '', '']}
var Server = function(host, port, path, files) {
	this.host = host;
	this.port = port;
	this.path = path;
	staticFiles = files;
	this.create();
}

util.inherits(Server, eventEmitter);

Server.prototype.create = function() {
  var self = this;
  var fServ = new static.Server(this.path);
  http.createServer(function(req, res) {
      if(isStatic(req.url)) {
         fServ.serve(req, res, function(e, result) {
           if (e) {
             console.log('blad --> ' + req.url);
             self.emit('blad', req, res);
             res.end('\n');
           } else {
             //res.writeHead(200, { 'Content-Type': 'text/html' }); 
             self.emit('static', req, res);
             console.log('static --> ' + req.url)
           }
         }); 
      } else {
        console.log('dynamic --> ' + req.url)
        self.emit('dynamic', req, res)
      }
	}).listen(this.port, this.host);
	console.log('Server running at ' + this.host + ':' + this.port);
}

exports.Server = Server;


//s.emit('eventName')
//s.on('eventName', callB)

