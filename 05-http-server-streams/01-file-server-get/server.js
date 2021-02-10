const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  console.log(pathname);

  switch (req.method) {
    case 'GET':

      let nDirNested = pathname.split('/').length;
      if (nDirNested > 1) {
        res.statusCode = 400;
        res.end();
      }      

      const file = fs.createReadStream(filepath);

      res.on('close', () => {
        file.unpipe().destroy();
      });

      file.on('error', (err) => {
        console.log('ОШИБКА: ', err);
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end();
        }

        file.unpipe().destroy();
      });

      file.pipe(res);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
