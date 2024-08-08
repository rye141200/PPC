/* eslint-disable no-useless-escape */

('use-strict');

import { Alert } from '../utils/alerts.mjs';
import { Cart } from '../utils/Cart.mjs';

//****** (1) PRODUCTS ******
//! Selectors
const productSectionEl = document.querySelector('#product-section');

//! Listeners
productSectionEl.addEventListener('click', async (e) => {
  if (
    !e.target.classList.contains('add-to-cart') &&
    !e.target.parentElement.classList.contains('add-to-cart')
  )
    return;

  let element = e.target;
  if (element.parentElement.classList.contains('add-to-cart'))
    //span or icon
    element = element.parentElement.parentElement;
  else element = element.parentElement;

  const product = Cart.constructProduct(element);
  Cart.addItem(product);
  await Alert.displaySuccess('Item added to cart!', 2500);
});
