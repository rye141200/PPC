/* eslint-disable */
'use strict';

import { Alert } from '../utils/alerts.mjs';
import { APIRequest } from '../utils/APIRequest.mjs';

//! Selectors
const addCategoryBtnEl = document.querySelector('#add-category-btn');
const updateCategoryBtnEl = document.getElementById('update-category-btn');
const deleteCategoryBtnEl = document.getElementById('delete-category');
const delay = 2000;
//! Helpers

//! Listeners
export const categoryDashboardModule = () => {
  if (addCategoryBtnEl)
    addCategoryBtnEl.addEventListener('click', async (e) => {
      e.preventDefault();

      const category = document.querySelector('#category-name').value;
      if (!category || category.length === 0) return;

      const resObj = await APIRequest.SendRequestAndGetInfo(
        '/category',
        'POST',
        {
          name: category,
        },
      );
      if (resObj.ok) {
        await Alert.displaySuccess('Category created successfully!', delay);
        window.location.reload();
      } else await Alert.displayFailure(resObj.res.message, delay);
    });
  if (updateCategoryBtnEl)
    updateCategoryBtnEl.addEventListener('click', async (e) => {
      e.preventDefault();

      const name = document.querySelector('#name').value;
      const categoryId = updateCategoryBtnEl.dataset.productId;
      if (name.length === 0)
        return await Alert.displayFailure('Name can not be empty!', 2000);

      if (name === updateCategoryBtnEl.dataset.categoryName)
        return await Alert.displayFailure('No changes have been done!', 2000);
      const resObj = await APIRequest.SendRequestAndGetInfo(
        `/category/${categoryId}`,
        'PATCH',
        { name },
      );

      if (resObj.ok) {
        await Alert.displaySuccess('Updated successfully!', 2000);
        window.location.href = `/admin/dashboard/categories/${resObj.res.data.category.slug}`;
      } else await Alert.displayFailure(resObj.res.message, 2000);
    });
  if (deleteCategoryBtnEl)
    deleteCategoryBtnEl.addEventListener('click', async (e) => {
      const id = deleteCategoryBtnEl.dataset.productId;
      const resObj = await APIRequest.sendRequestToAPI(
        `/category/${id}`,
        'DELETE',
      );
    });
};
