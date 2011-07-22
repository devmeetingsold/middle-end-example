var http = require('http'),
    fs = require('fs');

var modelFile = fs.readFileSync('dummy-model.js').toString('utf8');
//start "apache server"
http.createServer(function (req, res) {
    console.log("Apache got request:" + req.url);
    
    if (req.url === '/favicon.ico') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end();
        return;
    }
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(modelFile);
}).listen(8888, "127.0.0.1");
console.log('Apache :D server running at http://127.0.0.1:8888/');