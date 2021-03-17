const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function (socket, next) {
    let sToken = socket.handshake.query.token;

    if (!sToken) return next(new Error("anonymous sessions are not allowed"));

    let oSession = await Session.findOne({ 'token': sToken }).populate('user');
    if (!oSession) return next(new Error("wrong or expired session token"));

    socket.user = oSession.user;

    next();
  });

  io.on('connection', function (socket) {
    socket.on('message', async (msg) => {
      await Message.create({ date: new Date(), text: msg, chat: socket.user._id, user: socket.user.displayName });
    });
  });

  return io;
}

module.exports = socket;