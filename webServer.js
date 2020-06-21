const http = require('http');
const fs = require('fs');
const wd = "./pages/";
http.createServer( (req, res) => {
    switch (req.url) {
        case '/':
            fs.readFile(wd + 'index.html', 'utf8', (err, contents) => {
                if (err) {
                    res.writeHead(404,{"Content-Type": "text/plain"});
                    res.write("Something went wrong. Looks like the requested file does not exist! OH NO!");
                    res.end();
                } else {
                    res.writeHead(200,{"Content-Type": "text/html"});
                    res.write(contents);
                    res.end();
                }
            });
            break;
        case '/extsrc/index.js':
            fs.readFile(wd + 'index.js', 'utf8', (err, contents) => {
                if (err) {
                    res.writeHead(404,{"Content-Type": "text/plain"});
                    res.write("Something went wrong. Looks like the requested file does not exist! OH NO!");
                    res.end();
                } else {
                    res.writeHead(200,{"Content-Type": "text/javascript"});
                    res.write(contents);
                    res.end();
                }
            });
            break;
        case '/extsrc/index.css':
            fs.readFile(wd + 'index.css', 'utf8', (err, contents) => {
                if (err) {
                    res.writeHead(404,{"Content-Type": "text/plain"});
                    res.write("Something went wrong. Looks like the requested file does not exist! OH NO!");
                    res.end();
                } else {
                    res.writeHead(200,{"Content-Type": "text/css"});
                    res.write(contents);
                    res.end();
                }
            });
            break;
        case '/ping/':
            fs.readFile(wd + 'utils/ping.html', 'utf8', (err, contents) => {
                if (err) {
                    res.writeHead(404,{"Content-Type": "text/plain"});
                    res.write("Something went wrong. Looks like the requested file does not exist! OH NO!");
                    res.end();
                } else {
                    res.writeHead(200,{"Content-Type": "text/html"});
                    res.write(contents);
                    res.end();
                }
            });
            break;
        case '/extsrc/ping.js':
            fs.readFile(wd + 'utils/ping.js', 'utf8', (err, contents) => {
                if (err) {
                    res.writeHead(404,{"Content-Type": "text/plain"});
                    res.write("Something went wrong. Looks like the requested file does not exist! OH NO!");
                    res.end();
                } else {
                    res.writeHead(200,{"Content-Type": "text/javascript"});
                    res.write(contents);
                    res.end();
                }
            });
            break;
        case '/extsrc/ping.css':
            fs.readFile(wd + 'utils/ping.css', 'utf8', (err, contents) => {
                if (err) {
                    res.writeHead(404,{"Content-Type": "text/plain"});
                    res.write("Something went wrong. Looks like the requested file does not exist! OH NO!");
                    res.end();
                } else {
                    res.writeHead(200,{"Content-Type": "text/css"});
                    res.write(contents);
                    res.end();
                }
            });
            break;
        case '/ping/pingjson.js':
            fs.readFile(wd + 'utils/pingjson.js', 'utf8', (err, contents) => {
                if (err) {
                    res.writeHead(404,{"Content-Type": "text/plain"});
                    res.write("Something went wrong. Looks like the requested file does not exist! OH NO!");
                    res.end();
                } else {
                    res.writeHead(200,{"Content-Type": "text/javascript"});
                    res.write(contents);
                    res.end();
                }
            });
            break;
        default:
            res.writeHead(404,{"Content-Type": "text/html"});
            res.write("Sorry, but the page you are trying to look for does not exist. :/ <br><br><a href='/'>HOME</a>");
            res.end();
    }
}).listen(8080);