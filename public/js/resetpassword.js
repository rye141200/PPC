/* eslint-disable */
'use-strict';

import { APIRequest } from '../utils/APIRequest.mjs';
import { Validator } from '../utils/Validator.mjs';
import { Alert } from '../utils/alerts.mjs';
//! Selectors

const resetPasswordBtnEl = document.querySelector('#reset-password-btn');
const showPasswordCheckBoxEl = document.querySelector(
  '#show-password-reset-password',
);
const resetPasswordInputEl = document.querySelector('#new-password-input');

showPasswordCheckBoxEl.addEventListener('click', () => {
  if (resetPasswordInputEl.type === 'password')
    resetPasswordInputEl.type = 'text';
  else resetPasswordInputEl.type = 'password';
});

resetPasswordBtnEl.addEventListener('click', async (e) => {
  e.preventDefault();
  const resetToken = window.location.pathname.split('/')[2];
  if (
    !resetPasswordInputEl.value ||
    !Validator.isValidPassword(resetPasswordInputEl.value)
  )
    return await Alert.displayFailure('You cant use this password!', 2000);
  const response = await APIRequest.sendRequestToAPI(
    `/user/resetPassword/${resetToken}`,
    'PATCH',
    { password: resetPasswordInputEl.value },
  );
  if (response) await Alert.displaySuccess('Logged in successfully', 2000);
  else await Alert.displayFailure('Could not update password', 2000);
  window.location.href = '/';
});
