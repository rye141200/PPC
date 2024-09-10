/* eslint-disable import/prefer-default-export */
export class Cart {
  static cartKey = 'cart';

  // Load cart from local storage or initialize as an empty array
  static loadCart() {
    const cartJSON = localStorage.getItem(this.cartKey);
    return cartJSON ? JSON.parse(cartJSON) : [];
  }

  // Save cart to local storage
  static saveCart(cart) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }

  // Add item to cart
  static addItem(product, count = 1) {
    let cart = this.loadCart();
    const existingItem = cart.find(
      (item) => item.product.name === product.name,
    );
    if (existingItem) {
      existingItem.count += count;
    } else {
      cart.push({ product: product, count: count });
    }
    this.saveCart(cart);
    this.handleCartCount();
  }

  // Get all items from cart
  static getItems() {
    return this.loadCart();
  }

  // Increment the count of an item in the cart
  static incrementItem(product) {
    let cart = this.loadCart();
    const item = cart.find((item) => item.product.name === product.name);
    if (item) {
      item.count += 1;
      this.saveCart(cart);
    }
  }

  static setItem(product, count) {
    let cart = this.loadCart();
    const item = cart.find((item) => item.product.name === product.name);
    if (item) {
      item.count = count;
      this.saveCart(cart);
    }
  }
  // Decrement the count of an item in the cart
  static decrementItem(product) {
    let cart = this.loadCart();
    const item = cart.find((item) => item.product.name === product.name);
    if (item) {
      item.count -= 1;
      if (item.count <= 0) {
        this.removeItem(product);
      } else {
        this.saveCart(cart);
      }
    }
  }

  // Remove an item from the cart
  static removeItem(product) {
    let cart = this.loadCart();
    cart = cart.filter((item) => item.product.name !== product.name);
    this.saveCart(cart);
  }

  static getCount() {
    return this.loadCart().reduce((count, el) => count + el.count, 0);
  }
  // Clear the cart
  static clearCart() {
    this.saveCart([]);
  }
  static constructProduct(element) {
    const productInfo = element.querySelector('.product-name');
    const name = productInfo.textContent.trim();
    const id = productInfo.dataset.productId;
    const image = element.querySelector('.product-img').getAttribute('src');
    const price = Number.parseFloat(
      element.querySelector('.product-price').textContent,
    );
    const discount = Number.parseFloat(
      element.querySelector('.product-price').dataset.discount,
    );
    const description = element
      .querySelector('.product-description')
      .textContent.trim();

    return {
      name,
      id,
      image,
      price,
      description,
      discount,
    };
  }
  static handleCart(e, updateTotalPrice, productsList) {
    const element = e.target;
    if (
      !element.classList.contains('increment-btn') &&
      !element.classList.contains('decrement-btn') &&
      !element.classList.contains('delete-btn-cart')
    )
      return true;

    if (element.classList.contains('increment-btn')) {
      this.incrementItem({ name: element.dataset.productName });
    } else if (element.classList.contains('decrement-btn'))
      this.decrementItem({ name: element.dataset.productName });
    else {
      const item = this.loadCart().filter(
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
    this.handleCartCount();
  }
  static handleCartCount = () => {
    const itemsCount = Cart.getCount();
    const cartCounterEl = document.querySelector('#notify-cart');
    const cartCounterTextEl = document.querySelector('#cart-counter');
    if (itemsCount == 0) cartCounterEl.classList.add('hidden');
    else {
      cartCounterTextEl.textContent = itemsCount;
      cartCounterEl.classList.remove('hidden');
    }
  };
}
