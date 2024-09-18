import { Cart } from '../utils/Cart.mjs';
import { Alert } from '../utils/alerts.mjs';

//! Selectors
const productsList = document.querySelector('#products-list');
const checkoutBtnEl = document.querySelector('#checkout-btn');
const subtotalEl = document.querySelector('#subtotal');
const discountEl = document.querySelector('#discount');
const totalEl = document.querySelector('#total');
const cartHeaderEl = document.querySelector('#cart-header');
const loggedIn =
  !document?.querySelector('#user-menu-button')?.classList.contains('hidden') ??
  null;

const resetPrices = () => {
  subtotalEl.textContent = 0 + ' SAR';
  discountEl.textContent = '-' + 0 + ' SAR';
  totalEl.textContent = `0 SAR`;
  document.querySelector('#cart-header').textContent = 'Your cart is empty';
};

const updateTotalPrice = () => {
  //!1) Getting the "real" prices from the db
  const cart = Cart.loadCart();
  let subtotal = 0;
  let discount = 0;

  //!2) Calculating the prices
  cart.forEach((el) => {
    // const item = cart.filter((item) => item.product.id === el._id)[0];
    subtotal += el.product.price * el.count;
    discount += el.product.price * el.count * el.product.discount;
  });
  subtotal = subtotal.toFixed(2);
  discount = discount.toFixed(2);

  const total = (subtotal - discount).toFixed(2);
  subtotalEl.textContent = subtotal + ' SAR';
  discountEl.textContent = '-' + discount + ' SAR';
  totalEl.textContent = `${(subtotal - discount).toFixed(2)} SAR`;
  return total;
};
export const checkoutModule = () => {
  console.log('Hey from the checkout module');
  productsList.addEventListener('click', async (e) => {
    //! In case of
    try {
      const notHandled = Cart.handleCart(e, updateTotalPrice, productsList);
      if (!notHandled)
        await Alert.displaySuccess('Updated successfully!', 2000);
    } catch (err) {
      await Alert.displayFailure('Could not update cart try again later', 2000);
    }
  });
  if (Cart.loadCart().length !== 0) cartHeaderEl.textContent = 'Your cart';
  document.addEventListener('DOMContentLoaded', () => {
    const cart = Cart.getItems();
    cart.forEach((el) => {
      const html = `<li id="product--${el.product.name.split(' ').join('-')}" class="flex items-center gap-4 ">
      <img
      src="${el.product.image}"
            alt="${el.product.name}"
            class="h-16 rounded object-cover"
            />
            
            <div>
            <h3 class="text-sm text-gray-900">${el.product.name}</h3>
            
            <dl class="mt-0.5 space-y-px text-[10px] text-gray-600">
            <div hidden md:block>
            <dt class="inline font-bold">Description:</dt>
            <dd class="inline">${el.product.description}</dd>
            </div>
            
            <div>
            <dt class="inline font-bold">Total price:</dt>
            <dd id="price--${el.product.name.split(' ').join('-')}" class="inline">${(el.product.price * el.count).toFixed(2)} SAR</dd>
            </div>
            </dl>
            </div>
            
            <div
            class="flex flex-1 items-center justify-end gap-2"
            x-data="{ productQuantity: ${el.count} }"
                  >
                    <label for="Quantity" class="sr-only"> Quantity </label>
                    
                    <div class="flex items-center gap-1"></div>
                    <button
                    type="button"
                    class="size-10 leading-10 text-gray-600 transition hover:opacity-75 decrement-btn"
                    x-on:click="productQuantity--"
                    :disabled="productQuantity === 1"
                    data-product-name="${el.product.name}"
                        >
                        &minus;
                        </button>
                        
                        <input
                        type="number"
                        min="1"
                        value="1"
                        id="Quantity"
                        x-model="productQuantity"
                        class="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&amp;::-webkit-inner-spin-button]:m-0 [&amp;::-webkit-inner-spin-button]:appearance-none [&amp;::-webkit-outer-spin-button]:m-0 [&amp;::-webkit-outer-spin-button]:appearance-none"
                        disabled
                        />
                        
                        <button
                        type="button"
                        x-on:click="productQuantity++"
                        
                        class="size-10 leading-10 text-gray-600 transition hover:opacity-75 increment-btn"
                        data-product-name="${el.product.name}"
                        >
                        &plus;
                        </button>
                        </div>
                        <ion-icon
                        class="h-6 w-6 cursor-pointer delete-btn-cart" 
                        name="trash-outline"
                        data-product-name="${el.product.name}"
                        data-product-id="${el.product.id}"></ion-icon>
                        </div>
                        </li>`;
      productsList.insertAdjacentHTML('beforeend', html);
    });
  });

  updateTotalPrice();

  document
    .querySelector('#checkout-btn')
    .addEventListener('click', async () => {
      if (!loggedIn) {
        document.querySelector('#login-btn').click();
        return Alert.displayFailure(
          'You must be logged in to make an order!',
          2000,
        );
      }
      if (productsList.children.length === 0)
        return Alert.displayFailure('Your cart is empty!', 2000);

      //!DISPLAY MAP TO COMPLETE CHECKOUT
      window.location.href = '/checkout-location';
    });
};
