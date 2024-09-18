/* eslint-disable */
'use strict';

import { Alert } from '../utils/alerts.mjs';
import { APIRequest } from '../utils/APIRequest.mjs';

//
//! Selectors
const restoreBtn = document.querySelector('#restore-btn');
export const restoreProductModule = () =>
  restoreBtn.addEventListener('click', async (e) => {
    const { productId } = restoreBtn.dataset;
    const resObj = await APIRequest.SendRequestAndGetInfo(
      `/product/restore/${productId}`,
      'PATCH',
      {
        deleted: false,
      },
    );
    if (resObj.ok) {
      await Alert.displaySuccess('Product restored successfully!', 2000);
      console.log(resObj);
      window.location.href = `/admin/dashboard/products/${resObj.res.data.product.slug}`;
    } else await Alert.displayFailure(resObj.res.message, 2000);
  });
