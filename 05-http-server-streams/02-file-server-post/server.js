const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require("./LimitSizeStream");

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':

      let nDirNested = pathname.split('/').length;
      if (nDirNested > 1) {
        res.statusCode = 400;
        return res.end();
      }

      let myTransformStream = new LimitSizeStream({limit: 1048576});
      let file = fs.createWriteStream(filepath, {flags: 'wx'});

      req.pipe(myTransformStream).pipe(file);
      
      file.on('error', err => {
        console.log('FILE ERROR::: ', err.code);
        if (err.code === 'ENOENT') {
          console.log('404 - NOT FOUND...')
          res.statusCode = 404;
          res.end('NOT FOUND');
          return;
        }
        if (err.code === 'EEXIST') {
          console.log('409 - NOT EXIST...')
          res.statusCode = 409;
          res.end('NOT EXIST');
          return;
        }

        console.log('500 - INTERNAL ERROR...')
        res.statusCode = 500;
        res.end('INTERNAL ERROR');
      })

      file.on('finish', () => {
        console.log('201 - FILE CREATED')
        res.statusCode = 201;
        res.end('201');
      })


      req.on('error', err => {
        console.log('REQ ERROR::: ', err.code);
        if (err.code = 'ECONNRESET') {
          res.statusCode = 500;
          res.end('CONNECTION RESET'); 
          fs.unlink(filepath, () => {});
        } else {
          res.statusCode = 500;
          res.end('500');
        }
      });

      req.on('aborted', () => {
        res.statusCode = 500;
        res.end('CONNECTION ABORTED');
        fs.unlink(filepath, () => {});
      })

      myTransformStream.on('error', err => {
        if (err.code = 'LIMIT_EXCEEDED') {  
          res.statusCode = 413;
          res.end('413');
          fs.unlink(filepath, () => {});
        } else {
          res.statusCode = 500;
          res.end('SOMETHING WRONG..');
        }
      })

      break;

    default:
      res.statusCode = 501;
      return res.end('Not implemented');
  }
});

module.exports = server;
