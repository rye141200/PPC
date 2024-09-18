/* eslint-disable no-useless-escape */

('use-strict');

import { Alert } from '../utils/alerts.mjs';
import { Cart } from '../utils/Cart.mjs';

//****** (1) PRODUCTS ******
//! Selectors
const productSectionEl = document.querySelector('#product-section');
// const loggedIn = !document
//   ?.querySelector('#user-menu-button')
//   .classList.contains('hidden');

//! Listeners
export const homeModule = () => {
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

    //! If user was logged in, interact with cart in DB else,
    //! Add to local storage لحد ما تفرج
    Cart.addItem(product);
    return await Alert.displaySuccess('Item added to cart!', 2500);
  });

  /* pagination*/
  document.addEventListener('DOMContentLoaded', function () {
    const currentPageNumber = +new URLSearchParams(window.location.search).get(
      'page',
    );
    const anchorTag = document.querySelector(
      `a[href="/?page=${currentPageNumber}"]`,
    );
    anchorTag?.classList.remove(
      'bg-white',
      'text-gray-500',
      'hover:bg-gray-100',
      'hover:text-gray-700',
    );
    anchorTag?.classList.add('bg-mulledWine', 'text-white');

    const previousPageBtn = document.getElementById('previous-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');

    nextPageBtn.href = `/?page=${currentPageNumber + 1}`;
    if (currentPageNumber === 1)
      previousPageBtn.classList.add(
        'pointer-events-none',
        'opacity-50',
        'cursor-not-allowed',
      );
    else previousPageBtn.href = `/?page=${currentPageNumber - 1}`;
  });
};
