('use-strict');

import { Alert } from '../utils/alerts.mjs';
import { Validator } from '../utils/Validator.mjs';
import { APIRequest } from '../utils/APIRequest.mjs';

//!selectors
const saveChangesBtn = document.querySelector('#submit-changes');
const savePassBtn = document.querySelector('#save-password');
const formPassEl = document.querySelector('#new-password');
const formBoxEl = document.querySelector('#personal-details');
const delay = 1500;
Validator.validateField([formBoxEl]);
Validator.validateField([formPassEl]);
//! Listeners
saveChangesBtn.addEventListener('click', async (e) => {
  const nameInput = document.querySelector('.name');
  const emailInput = document.querySelector('.email');
  const phoneInput = document.querySelector('.phone');
  //* 1.check if the Credentials did not change
  if (phoneInput.value == 0 && emailInput.value == 0 && nameInput.value == 0) {
    return await Alert.displaySuccess('No changes happend up so far', delay);
  }
  //* 2.ckeck the validity of the Credentials
  if (!Validator.isValidEmail(emailInput.value) && !emailInput.value == 0) {
    return await Alert.displayFailure('Wrong email !', delay);
  }
  if (
    !Validator.isValidPhoneNumber(phoneInput.value) &&
    !phoneInput.value == 0
  ) {
    return await Alert.displayFailure('Wrong phone number !', delay);
  }
  if (nameInput.value || emailInput.value || phoneInput.value) {
    //* 3. send the request
    const response = await APIRequest.sendRequestToAPI('/updateMe', 'PATCH', {
      name: nameInput.value || nameInput.Placeholder,
      email: emailInput.value || emailInput.Placeholder,
      phone: phoneInput.value || phoneInput.Placeholder,
    });
    if (response) {
      await Alert.displaySuccess('Changes have been made', delay);
      window.location.href = '/profile';
    } else {
      await Alert.displayFailure('Failed to update !', delay);
    }
  }
});

savePassBtn.addEventListener('click', async (e) => {
  const passwordCurrent = document.querySelector('.currentPass');
  const password = document.querySelector('.newPass');
  const passwordConfirm = document.querySelector('.confirmPass');
  if (
    passwordCurrent.value == 0 &&
    password.value == 0 &&
    passwordConfirm.value == 0
  ) {
    return await Alert.displaySuccess('No changes happend up so far', delay);
  }
  if (
    !Validator.isValidPassword(passwordCurrent.value) ||
    password.value != passwordConfirm.value
  ) {
    return await Alert.displayFailure('Wrong password!', delay);
  }
  const response = await APIRequest.sendRequestToAPI(
    '/updateMyPassword',
    'PATCH',
    {
      passwordCurrent: passwordCurrent.value,
      password: password.value,
      passwordConfirm: passwordConfirm.value,
    },
  );
  if (response) {
    await Alert.displaySuccess('Password has been changed', delay);
    window.location.href = '/profile';
  } else {
    await Alert.displayFailure('Current password is wrong!', delay);
  }
});
