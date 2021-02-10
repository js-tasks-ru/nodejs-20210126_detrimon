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

      req.pipe(myTransformStream).pipe(file)
        .on('error', err => {
          if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end();
          }
          if (err.code === 'EEXIST') {
            res.statusCode = 409;
            file.destroy();
            res.end();
          }
        })
        .on('finish', () => {
          res.statusCode = 201;
          res.end();
        })
        .on('close', () => {
          console.log(pathname, ' CLOSED');
        })


        req.on('error', err => {
          if (err.code = 'ECONNRESET') {
            fs.unlink(filepath, err => {
              if (err) throw err;
              file.end();
              // myTransformStream.destroy();
              res.end();            
            });
          }
        });

      myTransformStream.on('error', err => {
        if (err.code = 'LIMIT_EXCEEDED') {          
          fs.unlink(filepath, err => {
            if (err) throw err;
          });
          file.end();
          res.statusCode = 413;
          res.end();
        }
      })

      break;

    default:
      res.statusCode = 501;
      return res.end('Not implemented');
  }
});

module.exports = server;
