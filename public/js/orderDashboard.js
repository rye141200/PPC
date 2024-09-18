/* eslint-disable */
'use strict';

import { APIRequest } from '../utils/APIRequest.mjs';
import { Alert } from '../utils/alerts.mjs';

//! Elements
const pendingAnchorEl = document.querySelector('#pending');
const acceptedAnchorEl = document.querySelector('#accepted');
const shippedAnchorEl = document.querySelector('#shipped');
const cancelledAnchorEl = document.querySelector('#cancelled');
const orderContainerEl = document.querySelector('#order-container');
const orderOptions = document.querySelector('#order-options');

const orderStatusContianerDiv = document.querySelector(
  '.order-status-container',
);
//! helper methods
const activateAnchor = function (anchorElement) {
  anchorElement.classList.add('bg-mulledWine', 'text-white');
  anchorElement.classList.remove('hover:bg-gray-300');
};
const decideNewStatus = (status) => {
  if (status === 'accepted') return 'shipped';
  else if (status === 'pending') return 'accepted';
};

const admitOrder = async (element) => {
  const currentStatus = window.location.pathname.split('/')[4];
  const status = decideNewStatus(currentStatus);
  const id = element.dataset.orderId;
  console.log(status);
  const resObj = await APIRequest.SendRequestAndGetInfo(
    '/order/status',
    'PATCH',
    {
      status,
      id,
    },
  );
  if (resObj.ok) {
    await Alert.displaySuccess('Admitted!', 2000);
    window.location.reload();
  } else await Alert.displayFailure(resObj.res.message, 5000);
};

const cancelOrder = async (element) => {
  const id = element.dataset.orderId;
  const resObj = await APIRequest.SendRequestAndGetInfo(
    '/order/status',
    'PATCH',
    {
      status: 'cancelled',
      id,
    },
  );
  if (resObj.ok) {
    await Alert.displaySuccess('Order successfully cancelled!', 2000);
    window.location.reload();
  } else await Alert.displayFailure(resObj.res.message, 5000);
};

const revokeOrder = async (element) => {
  const id = element.dataset.orderId;
  const resObj = await APIRequest.SendRequestAndGetInfo(
    '/order/status',
    'PATCH',
    {
      status: 'pending',
      id,
    },
  );
  if (resObj.ok) {
    await Alert.displaySuccess('Order successfully revoked!', 2000);
    window.location.reload();
  } else await Alert.displayFailure(resObj.res.message, 5000);
};

//! Handlers
export const orderDashboardModule = () => {
  orderContainerEl.addEventListener('click', async (e) => {
    const element = e.target;
    if (
      !element.classList.contains('admit-btn') &&
      !element.classList.contains('cancel-order') &&
      !element.classList.contains('revoke-btn')
    )
      return;

    if (element.classList.contains('admit-btn')) admitOrder(element);
    else if (element.classList.contains('cancel-order')) cancelOrder(element);
    else revokeOrder(element);
  });

  document.addEventListener('DOMContentLoaded', function () {
    if (window.location.href.includes('pending')) {
      activateAnchor(pendingAnchorEl);
    } else if (window.location.href.includes('accepted')) {
      activateAnchor(acceptedAnchorEl);
    } else if (window.location.href.includes('shipped')) {
      activateAnchor(shippedAnchorEl);
    } else if (window.location.href.includes('cancelled')) {
      activateAnchor(cancelledAnchorEl);
    }
  });
};
