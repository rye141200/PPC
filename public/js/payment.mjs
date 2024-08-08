/* eslint-disable no-undef */
/* eslint-disable no-constructor-return */
Moyasar.init({
  element: '.mysr-form',
  amount: 10000,
  currency: 'SAR',
  description: 'Order #123',
  publishable_api_key: 'pk_test_V2H52ztJRKs12miXdn3T7XTg6SrrjK7K9k7AeuA4',
  callback_url:
    'https://def7-2001-16a2-ed3d-7f00-9c3d-4dba-1f7a-b850.ngrok-free.app/pay',
  methods: ['creditcard'],
  on_completed: async (payment) => {
    //!1) Initializing the order object
    const order = {
      user: '66a6cd174679e25708339259',
      products: [
        { product: '66a0406ab55a121c206002ed', count: 2 },
        { product: '66a0407f41e46a5f04c73335', count: 1 },
      ],
      paymentMethod: 'credit card',
      location: 'https://www.google.com/maps?q=21.593955,39.1530033',
      paymentID: payment.id,
    };
    //!2) Storing into the database with the paymentID
    const response = await fetch('/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    const data = await response.json();
    console.log(data);
    if (data.status === 'success') console.log('Order created!');
    else console.log('Order failed!');
  },
});

//* VALIDATE THEN SAVE ORDER INTO THE DATABASE
