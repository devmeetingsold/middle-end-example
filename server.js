var http = require('http'),
    jsdom = require('jsdom'),
    fs = require('fs'),
    url = require('url'),
    querystring = require('querystring'),
    mystatic = require('./mystatic'),
    httpget = require('./httpget').httpget,
    validator = require('./lib-client/validator');
    
var __appPath = '',
 __staticPath = './lib-client', 
 __scripts = [
    '/jquery.js',
    '/mustache.js',
    '/flights.js',
    '/paragraph.js',
    '/validator.js',
    '/init.js'
];
templateHtml = fs.readFileSync(__appPath + 'html/index.html').toString('utf8');

var __model = {};
__model.snippets = {};
['flights'].forEach(function(el){
  __model.snippets[el] = fs.readFileSync(__appPath + 'html/' + el + '.html').toString('utf8');
});

var server = new mystatic.Server('localhost', '1337', __staticPath, ['html', 'css', 'js', 'ico', 'jpg', 'gif', 'png']);

server.on('dynamic', function(req, res){
    if (url.parse(req.url).pathname === '/send' && req.method === 'POST') {
        var postContent = '';
        console.log('post');
        req.on('data', function(chunk) {
          postContent+= chunk;
        });
        
        req.on('end', function() {
          var values = querystring.parse(postContent);
            console.log(values);
            var rules = {
                name: ["required"],
                lastname: ["required"]
            };
            
            var errors = validator.validate(values, rules);
            console.log('VALIDATION ERRORS: ' + errors.map(function(err) {
                return err.field + ":" + err.message;
            }));
        });
    }

    
    var query = url.parse(req.url).query;
    httpget('localhost', '/', 8888, function(data) {
        __model.data = JSON.parse(data);
        res.writeHead(200, { 'Content-Type': 'text/html' }); 
        
        if (query === "fallback" ) {
            jsdom.env({
                html: templateHtml.replace('{{scripts}}', ''),
                scripts: __scripts.map(function(el){
                  return el.indexOf("http") === 0 ? el : __staticPath + el;
                }),
                done: function(errors, window) {
                    errors && console.log(errors);
                    
                    var __doc = window.document;
                    
                    window.jQuery.fx.off = true;
                    window.init(__model); //?
                    
                    var scripts = __doc.getElementsByTagName('script');
                    var scriptArr = Array.prototype.slice.call(scripts);
                    
                    for(var i = 0; i < scriptArr.length; i++) {
                        var s = scriptArr[i];
                        s.parentNode.removeChild(s);
                    }
                    
                    res.write(window.document.doctype.toString());
                    res.write(window.document.innerHTML);
                    res.end();
                }
            });
        } else {
            var dynamicScripts = __scripts.map(function(el) {
              return '<script type="text/javascript" src="' + el + '"></script>';
            })
            
            dynamicScripts.push('<script type="text/javascript">window.init(' + JSON.stringify(__model) + ')</script>');   
            
            res.end(templateHtml.replace('{{scripts}}', dynamicScripts.join('')));
        }
    });
    
});