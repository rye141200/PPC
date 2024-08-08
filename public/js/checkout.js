import { Cart } from '../utils/Cart.mjs';
import { APIRequest } from '../utils/APIRequest.mjs';

//! Selectors
const productsList = document.querySelector('#products-list');
const subtotalEl = document.querySelector('#subtotal');
const discountEl = document.querySelector('#discount');
const totalEl = document.querySelector('#total');

const updateTotalPrice = async () => {
  //!1) Getting the "real" prices from the db
  const cart = Cart.loadCart();
  const ids = cart.map((el) => el.product.id).join(',');

  const response = await APIRequest.sendQueryRequest(
    `/product/cart/?_id=${ids}`,
    'GET',
  );
  let subtotal = 0;
  let discount = 0;

  //!2) Calculating the prices
  response.products.forEach((el) => {
    const item = cart.filter((item) => item.product.id === el._id)[0];
    subtotal += el.price * item.count;
    discount += el.price * item.count * el.discount;
  });
  subtotal = subtotal.toFixed(2);
  discount = discount.toFixed(2);
  const total = (subtotal - discount).toFixed(2);
  subtotalEl.textContent = subtotal + ' SAR';
  discountEl.textContent = '-' + discount + ' SAR';
  totalEl.textContent = `${(subtotal - discount).toFixed(2)} SAR`;
  return total;
};

updateTotalPrice();

document.addEventListener('DOMContentLoaded', () => {
  const cart = Cart.getItems();
  cart.forEach((el) => {
    const html = `<li id="product--${el.product.name.split(' ').join('-')}" class="flex items-center gap-4">
                <img
                  src="${el.product.image}"
                  alt="${el.product.name}"
                  class="h-16 rounded object-cover"
                />

                <div>
                  <h3 class="text-sm text-gray-900">${el.product.name}</h3>

                  <dl class="mt-0.5 space-y-px text-[10px] text-gray-600">
                    <div>
                      <dt class="inline">Description:</dt>
                      <dd class="inline">${el.product.description}</dd>
                    </div>

                    <div>
                      <dt class="inline">Total price:</dt>
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

                  <button class="text-gray-600 transition hover:text-red-600 delete-btn">
                    <span class="sr-only">Remove item</span>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="h-4 w-4 delete-btn"
                      data-product-name="${el.product.name}"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </li>`;
    productsList.insertAdjacentHTML('beforeend', html);
  });
});

productsList.addEventListener('click', async (e) => {
  const element = e.target;
  if (
    !element.classList.contains('increment-btn') &&
    !element.classList.contains('decrement-btn') &&
    !element.classList.contains('delete-btn')
  )
    return;

  if (element.classList.contains('increment-btn'))
    Cart.incrementItem({ name: element.dataset.productName });
  else if (element.classList.contains('decrement-btn'))
    Cart.decrementItem({ name: element.dataset.productName });
  else {
    const item = Cart.loadCart().filter(
      (el) => element.dataset.productName === el.product.name,
    )[0];
    Cart.removeItem(item.product);
    productsList.removeChild(
      document.querySelector(
        `#product--${element.dataset.productName.split(' ').join('-')}`,
      ),
    );
    updateTotalPrice();
  }

  if (
    element.classList.contains('increment-btn') ||
    element.classList.contains('decrement-btn')
  ) {
    const item = Cart.loadCart().filter(
      (el) => element.dataset.productName === el.product.name,
    )[0];
    document.querySelector(
      `#price--${element.dataset.productName.split(' ').join('-')}`,
    ).textContent = `${(item.product.price * item.count).toFixed(2)} SAR`;
    updateTotalPrice();
  }
});
document.querySelector('#checkout-btn').addEventListener('click', async () => {
  const total = await updateTotalPrice();
  console.log('Checkout for:' + totalEl.textContent);
  await APIRequest.sendRequestToAPI(`/checkout-location/${total}`, 'GET');
});
/**
 *
 */
