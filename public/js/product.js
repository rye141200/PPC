/*eslint-disable*/
'use strict';

import { APIRequest } from '../utils/APIRequest.mjs';
import { Cart } from '../utils/Cart.mjs';
import { Alert } from '../utils/alerts.mjs';

//! Helpers
const resetCount = () => {
  document.getElementById('bedrooms-input').value = 1;
};
//! Selectors
const addToCartBtnEl = document.querySelector('.add-to-cart');
const loggedIn = !document
  ?.querySelector('#user-menu-button')
  .classList.contains('hidden');

//! Listeners
addToCartBtnEl.addEventListener('click', async (e) => {
  //? 1) Get the count
  const count = +document.getElementById('bedrooms-input').value;

  //? 2) Add to cart
  const product = Cart.constructProduct(document);

  Cart.addItem(product, count);
  resetCount();
  return await Alert.displaySuccess('Item added successfully', 2000);
});
