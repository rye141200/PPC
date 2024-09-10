/* eslint-disable */
'use strict';

import { Alert } from '../utils/alerts.mjs';
import { APIRequest } from '../utils/APIRequest.mjs';
//! Selectors
const updateProductBtnEl = document.querySelector('#update-product-btn');
const addProductBtnEl = document.querySelector('#add-product-btn');
const deleteProductBtnEl = document.querySelector('#delete');
//! Helpers
const isFormDataEmpty = (formData) => {
  for (const _ of formData.entries()) return false;
  return true;
};

const isChanged = (e, id) => {
  const element = e.target.parentElement.parentElement.querySelector(`#${id}`);
  const datasetAttribute = 'product' + id.charAt(0).toUpperCase() + id.slice(1);
  return (
    element.value !== element.dataset[datasetAttribute] && element.value !== ''
  );
};
const getValue = (e, id) =>
  e.target.parentElement.parentElement.querySelector(`#${id}`).value;

const mutateProduct = (e, product) => {
  //?1) Check if fields changed
  if (getValue(e, 'image') !== '')
    product.append(
      'image',
      e.target.parentElement.parentElement.querySelector(`#image`).files[0],
    );
  if (isChanged(e, 'name')) product.append('name', getValue(e, 'name'));
  if (isChanged(e, 'discount'))
    product.append('discount', getValue(e, 'discount'));
  if (isChanged(e, 'price')) product.append('price', getValue(e, 'price'));
  if (isChanged(e, 'description'))
    product.append('description', getValue(e, 'description'));
  if (isChanged(e, 'category'))
    product.append('category', getValue(e, 'category'));
};

//! Listeners
if (updateProductBtnEl)
  updateProductBtnEl.addEventListener('click', async (e) => {
    e.preventDefault();
    const product = new FormData();

    //?1) Check if fields changed
    mutateProduct(e, product);
    if (isFormDataEmpty(product))
      return await Alert.displayFailure('You have not edited anything!', 2000);

    //?2) Check if any empty fields exist
    if (Object.values(product).some((field) => field == ''))
      return await Alert.displayFailure('Fields cant be empty!', 2000);

    product.append('referencename', getValue(e, 'name'));
    //?3) Sending the request
    const id = e.target.dataset.productId;
    const resObj = await APIRequest.sendImageFormRequest(
      `/product/${id}`,
      'PATCH',
      product,
    );
    if (resObj.ok) {
      await Alert.displaySuccess('Updated successfully!', 2000);
      window.location.href = `/admin/dashboard/products/${resObj.res.data.product.slug}`;
    } else await Alert.displayFailure(resObj.res.message, 3000);
  });

if (addProductBtnEl)
  addProductBtnEl.addEventListener('click', async (e) => {
    e.preventDefault();
    const numOfFields = [...e.target.parentElement.parentElement.children][0]
      .children.length;
    const product = new FormData();
    //!1) Mutating the product object
    mutateProduct(e, product);
    //!2) Validating if all fields are okay
    /* if (product.entries.length !== 6)
      return await Alert.displayFailure('All fields must be filled!', 2000); */

    //!3) Sending the request
    const resObj = await APIRequest.sendImageFormRequest(
      '/product',
      'POST',
      product,
    );
    if (resObj.ok) {
      Alert.displaySuccess('Created successfully!', 2000);
      window.location.reload();
    } else await Alert.displayFailure(resObj.res.message, 2000);
  });

if (deleteProductBtnEl)
  deleteProductBtnEl.addEventListener('click', async (e) => {
    const id = e.target.dataset.productId;

    const resObj = await APIRequest.sendRequestToAPI(
      `/product/${id}`,
      'DELETE',
    );
    if (resObj) {
      await Alert.displaySuccess('Deleted successfully!', 2000);
      window.location.href = '/admin/dashboard/products/';
    } else
      await Alert.displayFailure('Could not delete product, retry later', 2000);
  });
