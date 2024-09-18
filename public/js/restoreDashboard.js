/* eslint-disable */
'use strict';

import { Alert } from '../utils/alerts.mjs';
import { APIRequest } from '../utils/APIRequest.mjs';

//! Selectors
const restoreBtn = document.querySelector('#restore-btn');
export const restoreModule = (frontendName, backendName) =>
  restoreBtn.addEventListener('click', async (e) => {
    const Id = restoreBtn.dataset.productId;
    const resObj = await APIRequest.SendRequestAndGetInfo(
      `/${backendName}/restore/${Id}`,
      'PATCH',
      {
        deleted: false,
      },
    );
    if (resObj.ok) {
      await Alert.displaySuccess(
        `${backendName.charAt(0).toUpperCase() + backendName.slice(1)} restored successfully!`,
        2000,
      );
      console.log(resObj.res);
      window.location.href = `/admin/dashboard/${frontendName}/${resObj.res.data.document.slug}`;
    } else await Alert.displayFailure(resObj.res.message, 2000);
  });
