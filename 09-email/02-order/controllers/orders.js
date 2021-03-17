const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  let oOrder = ctx.request.body;
  oOrder.user = ctx.user;
  let createdOrder = await Order.create(oOrder);

  await sendMail({
    to: ctx.user.email,
    subject: 'Подтверждение заказа',
    locals: {
      id: createdOrder._id,
      product: {
        title: createdOrder.product
      }
    },
    template: 'order-confirmation',
  });

  ctx.status = 200;
  ctx.body = {
    order: createdOrder._id
  };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  let oUser = ctx.user;

  let oOrders = await Order.find({
    'user': oUser
  });
  ctx.status = 200;
  ctx.body = {
    orders: oOrders
  };
};