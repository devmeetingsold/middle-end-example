var http = require('http');

var httpGET = function (host, path, port, onEnd) {
    http.get({
        host: host,
        path: path,
        port: port
    },
    function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            onEnd(data);
        });
    });
};

exports.httpget = httpGET;