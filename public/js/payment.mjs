/* eslint-disable */
/* eslint-disable no-undef */
/* eslint-disable no-constructor-return */

import { APIRequest } from '../utils/APIRequest.mjs';
import { Cart } from '../utils/Cart.mjs';

//* VALIDATE THEN SAVE ORDER INTO THE DATABASE
window.addEventListener('DOMContentLoaded', async () => {
  const cart = Cart.loadCart();
  const productsList = cart.map((el) => {
    return {
      count: el.count,
      product: el.product.id,
    };
  });

  if (!cart.length || !localStorage.getItem('location'))
    window.location.href = '/';

  const res = await APIRequest.sendQueryRequest('/cart', 'POST', productsList);
  console.log(res);
  const constructOrder = (res, payment) => {
    let newOrder = {
      paymentMethod: 'credit card',
      location: JSON.parse(localStorage.getItem('location')),
      paymentID: payment.id,
      products: res.cart.products.map((el) => {
        return { product: el.product._id, count: el.count };
      }),
    };
    return newOrder;
  };

  const order = Moyasar.init({
    element: '.mysr-form',
    amount: `${res.cart.totalPrice * 100}`,
    currency: 'SAR',
    description: 'Order #123',
    publishable_api_key: 'pk_test_V2H52ztJRKs12miXdn3T7XTg6SrrjK7K9k7AeuA4',
    callback_url:
      'https://cd8b-2001-16a2-edf7-ed00-55e6-19e9-98c1-460a.ngrok-free.app/',
    methods: ['creditcard'],
    on_completed: async (payment) => {
      //!1) Initializing the order object
      if (res.status !== 'success') return;
      const order = constructOrder(res, payment);

      //!2) Storing into the database with the paymentID
      const response = await APIRequest.sendRequestToAPI(
        '/order',
        'POST',
        order,
      );
      if (response) console.log('Order created!');
      else console.log('Order failed!');
      //!3) Reset the localstorage
      localStorage.clear();
    },
  });
});
