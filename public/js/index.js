//! IMPORTS
const protocol = window.location.protocol;
const hostname = window.location.hostname;
const port = window.location.port;
// Construct the full URL
const fullUrl = port
  ? `${protocol}//${hostname}:${port}`
  : `${protocol}//${hostname}`;

// import '@babel/polyfill';
import { authenticationModule } from './login.js';
import { homeModule } from './home.js';
import { checkoutModule } from './checkout.js';
import { mapModule } from './map.js';
import { paymentModule } from './payment.mjs';
import { detailsModule } from './product.js';
import { productDashboardModule } from './productsDashboard.js';
import { orderDashboardModule } from './orderDashboard.js';
import { profileModule } from './profile.js';
import { forgotPasswordModule } from './forgotPassword.js';
import { resetPasswordModule } from './resetpassword.js';
import { categoryDashboardModule } from './categoryDashboard.js';
import { restoreModule } from './restoreDashboard.js';
//? Missing: restoreCategoryModule

//! SELECTORS
//* Home
const productSectionEl = document.querySelector('#product-section');

//* Authentication
const loginFormEl = document.querySelector('#login-form');
const forgotPassword = document.querySelector('#forgot-password-submit');
const resetPasswordBtnEl = document.querySelector('#reset-password-btn');

//* Checkout
const productsList = document.querySelector('#products-list');

//* Address
const addressEl = document.querySelector('#address');

//* Moyasar
const moyasarCallbackUrl = fullUrl + '/thanks-for-purchase';

//* Product details section
const addToCartBtnEl = document.querySelector('.add-to-cart');

// * Product dashboard
const updateProductBtnEl = document.querySelector('#update-product-btn');
const addProductBtnEl = document.querySelector('#add-product-btn');
const deleteProductBtnEl = document.querySelector('#delete');

//* Category dashboard
const addCategoryFormEl = document.querySelector('#add-category-form');
const updateCategoryBtnEl = document.getElementById('update-category-btn');

//* Search bar
const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');

//* Order dashboard
const orderContainerEl = document.querySelector('#order-container');

//* Profile
const saveChangesBtn = document.querySelector('#submit-changes');

//* Restore product
const restoreBtn = document.querySelector('#restore-btn');

//? Globals
const loggedIn =
  !document?.querySelector('#user-menu-button')?.classList.contains('hidden') ??
  null;

const delay = 3000;
const pathname = window.location.pathname;

//! Listeners

//! Home page (home.js)
if (productSectionEl && pathname === '/') homeModule();

//! Authentication (login.js,forgotPassword.js)
if (loginFormEl) authenticationModule();
if (forgotPassword) forgotPasswordModule();
if (resetPasswordBtnEl) resetPasswordModule();

//! Checkout (checkout.js)
if (productsList && pathname === '/checkout') checkoutModule();

//! Map (map.js)

if (addressEl && pathname === '/checkout-location') mapModule();

//! Payment (payment.js)
if (pathname === '/pay') paymentModule(moyasarCallbackUrl);

//! Product details (product.js)
if (addToCartBtnEl && pathname !== '/') detailsModule();

//! Product dashboard (productsDashboard.js)
if (updateProductBtnEl || addProductBtnEl || deleteProductBtnEl)
  productDashboardModule();

//! Search bar (searchBar.js)
if (searchBtn)
  searchBtn.addEventListener('click', async () => {
    const queryString = searchInput.value.trim();
    window.location.href = `/search?name=${queryString}&page=1`;
  });

//! Order dashboard (orderDashboard.js)
if (orderContainerEl) orderDashboardModule();

//! Profile (profile.js)
if (saveChangesBtn) profileModule();

//! Restore product (deletedProductDashboard.js)
if (restoreBtn && pathname === '/admin/dashboard/products/deleted')
  restoreModule('products', 'product');
if (restoreBtn && pathname === '/admin/dashboard/categories/deleted')
  restoreModule('categories', 'category');

//! Category dashboard (categoryDashboard.js)
if (addCategoryFormEl || updateCategoryBtnEl) categoryDashboardModule();
