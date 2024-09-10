/* eslint-disable */
import { APIRequest } from './APIRequest.mjs';
export class APICart {
  static async handleItem(productId, operation) {
    const res = await APIRequest.sendQueryRequest('/cart', 'PATCH', {
      productId,
      operation,
    });
    return res;
  }
  static async APICartHandler(e) {
    const element = e.target;
    if (
      !element.classList.contains('increment-btn') &&
      !element.classList.contains('decrement-btn') &&
      !element.classList.contains('delete-btn')
    )
      return;

    let result;
    if (element.classList.contains('increment-btn'))
      result = await this.handleItem(element.dataset.productId, 'increment');
    else if (element.classList.contains('decrement-btn'))
      result = await this.handleItem(element.dataset.productId, 'decrement');
    else result = await this.handleItem(element.dataset.productId, 'delete');
    return result;
  }
}
