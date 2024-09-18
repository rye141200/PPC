/*eslint-disable*/
'use strict';

import { Cart } from '../utils/Cart.mjs';
import { Alert } from '../utils/alerts.mjs';

//! Selectors
const addToCartBtnEl = document.querySelector('.add-to-cart');
/* const loggedIn = !document
  ?.querySelector('#user-menu-button')
  .classList.contains('hidden'); */

//! Helpers
const resetCount = () => {
  document.getElementById('quantity-input').value = 1;
};
//! Listeners
export const detailsModule = () =>
  addToCartBtnEl.addEventListener('click', async (e) => {
    //? 1) Get the count
    const count = +document.getElementById('quantity-input').value;

    //? 2) Add to cart
    const product = Cart.constructProduct(document);

    Cart.addItem(product, count);
    resetCount();
    return await Alert.displaySuccess('Item added successfully', 2000);
  });
