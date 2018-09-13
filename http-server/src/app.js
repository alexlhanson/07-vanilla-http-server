'use strict';

// 1st Party library
const http = require('http');
const fs = require('fs');

// Local Libraries
// parser will tear the URL apart and give us back an object with things like path, query params, etc.
// it will also deal with POST data and append JSON to req.body if sent
const parser = require('./lib/parser');

const requestHandler = (req, res) => {

  // Take a look here if you're interested to see what some parts of the request object are.
  // console.log('METHOD:', req.method);
  // console.log('HEADERS:', req.headers);
  // console.log('URL:', req.url);

  // In all cases, parse the URL
  parser(req)
    .then( req => {

      /* The "if" statements below are our "routes" and do the same things that express does (below) but 100% manually
           app.get('/', (req,res) => res.send('Hello From the Gutter'));
           app.get('/foo/bar/baz', (req,res) => res.send('Hello From the Gutter'));
      */
      if ( req.method === 'GET' && req.parsed.pathname === '/' ) {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.statusMessage = 'OK';

        // Send out some random HTML (actually, it's not totally random. Note how it includes req.url.query.you ...
        // That would show whatever you have in the URL after you = (http://localhost:3000?this=that&you=cool
        // res.write(`<!DOCTYPE html><html><body><h1>${req.query.you}</h1></body></html>`);
        // res.end();

        fs.readFile('./src/views/index.html', (err, data) => {
          if(err) throw err;
          
          let result = data.toString().replace(/{{data}}/, req.query.you);
          res.write(result);
          res.end();
        });

        return;
      }

      // Here, we have a "POST" request which will always return a JSON object.  That object will either be
      // the JSON that you posted in (just spitting it back out), or an error object, formatted to look like JSON
      else if ( req.method === 'POST' && req.parsed.pathname === '/data' ) {
        res.setHeader('Content-Type', 'text/json');
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.write( JSON.stringify(req.body) );
        res.end();
        return;
      }

      else {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 404;
        res.statusMessage = 'Not Found';
        res.write('Resource Not Found');
        res.end();
      }

    }) // closes the "then" of the parser promise
    .catch(err => {
      res.writeHead(500);
      res.write(JSON.stringify(err));
      res.end();
    });
};

// Server callback
const app = http.createServer(requestHandler);

// Expose the start and stop methods.  index.js will call on these.
module.exports = {
  start: (port, callback) => app.listen(port,callback),
  stop: (callback) => app.close(callback),
};
