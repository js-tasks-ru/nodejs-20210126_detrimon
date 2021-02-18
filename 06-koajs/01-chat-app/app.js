const path = require('path');
const Koa = require('koa');
const app = new Koa();
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const msgEmitter = new MyEmitter();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  await new Promise((resolve, reject) => {
    msgEmitter.once('message', (message) => {       
        resolve(message);
      });
    })
    .then(message => {
      ctx.body = message;
    });
});

router.post('/publish', async (ctx, next) => {
  let msg = ctx.request.body.message;
  if (msg && msg !== "") {
    msgEmitter.emit('message', msg);
  }
  ctx.body = 'OK';
});

app.use(router.routes());

module.exports = app;
