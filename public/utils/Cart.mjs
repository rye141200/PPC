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
    const description = element
      .querySelector('.product-description')
      .textContent.trim();
    return {
      name,
      id,
      image,
      price,
      description,
    };
  }
}
