/*eslint-disable*/
'use strict';

import { Cart } from '../utils/Cart.mjs';
import { Alert } from '../utils/alerts.mjs';
//! Selectors
const addToCartBtnEl = document.querySelector('.add-to-cart');

//! Listeners
addToCartBtnEl.addEventListener('click', (e) => {
  //? 1) Get the count
  const count = +document.getElementById('bedrooms-input').value;

  //? 2) Add to cart
  const product = Cart.constructProduct(document);
  Cart.addItem(product, count);

  //? 3) Display success
  Alert.displaySuccess('Item added successfully', 2000);
});
