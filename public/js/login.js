/*eslint-disable */
/* eslint-disable no-useless-escape */
('use-strict');

import { Alert } from '../utils/alerts.mjs';
import { Validator } from '../utils/Validator.mjs';
import { APIRequest } from '../utils/APIRequest.mjs';

//****** (1) AUTHENTICATION ******
//! Selectors
const loginSubmitBtnEl = document.querySelector('#login-submit');
const showPasswordLoginBtn = document.querySelector('#show-password-login');
const formBoxesEl = document.querySelectorAll('.form');
const logoutBtnEl = document.querySelector('#logout-btn');
const signupSubmitBtnEl = document.querySelector('#signup-submit');
const showPasswordSignupBtn = document.querySelector('#show-password-signup');
const delay = 3000;

//! Listeners

Validator.validateField(formBoxesEl);

loginSubmitBtnEl.addEventListener('click', async () => {
  const loginEmailInput = document.querySelector('#email-login');
  const loginPasswordInput = document.querySelector('#password-login');
  //* 1) Checking if fields are empty or not
  if (!loginEmailInput.value || !loginEmailInput.value)
    return await Alert.displayFailure('Empty fields required', delay);

  //* 2) Validating the email and the password
  if (
    !Validator.isValidEmail(loginEmailInput.value) ||
    !Validator.isValidPassword(loginPasswordInput.value)
  )
    return await Alert.displayFailure('Invalid email or password', delay);

  //* 3) Send the request
  const success = await APIRequest.sendRequestToAPI('/user/login', 'POST', {
    email: loginEmailInput.value,
    password: loginPasswordInput.value,
  });

  //* 4) Check for successful login and redirect
  if (success) {
    Alert.displaySuccess('Logged in successfully', delay);
    window.location.href = '/';
  } else Alert.displayFailure('Invalid email or password!', delay);
});

signupSubmitBtnEl.addEventListener('click', async () => {
  const signupNameInput = document.querySelector('#signup-name');
  const signupEmailInput = document.querySelector('#signup-email');
  const signupPasswordInput = document.querySelector('#signup-password');
  const signupPhoneInput = document.querySelector('#signup-phone');
  //* 1) Checking if fields are empty or not
  if (
    !signupNameInput.value ||
    !signupEmailInput.value ||
    !signupPasswordInput.value ||
    !signupPhoneInput.value
  )
    return await Alert.displayFailure('Empty fields required', delay);

  //* 2) Validating the name
  if (signupNameInput.value.length > 30)
    return await Alert.displayFailure('Invalid name', delay);

  //* 3) Validating the email
  if (!Validator.isValidEmail(signupEmailInput.value))
    return await Alert.displayFailure('Invalid email', delay);

  //* 4) Validating the password
  if (!Validator.isValidPassword(signupPasswordInput.value))
    return await Alert.displayFailure('Invalid password', delay);

  //* 5) Validating the phone number
  if (!Validator.isValidPassword(signupPhoneInput.value))
    return await Alert.displayFailure('Invalid phone number', delay);

  //* 6) Send the request
  const success = await APIRequest.sendRequestToAPI('/user/signup', 'POST', {
    name: signupNameInput.value,
    email: signupEmailInput.value,
    password: signupPasswordInput.value,
    phone: `+966${signupPhoneInput.value}`,
  });
  //* 7) Checking if successful or not and redirecting
  if (success) {
    Alert.displaySuccess('Signed up successfully..', delay);
    window.location.href = '/';
  } else Alert.displayFailure('Email already exists!', delay);
});

showPasswordSignupBtn.addEventListener('click', () => {
  const signupPasswordInput = document.querySelector('#signup-password');
  if (signupPasswordInput.type === 'password') {
    signupPasswordInput.type = 'text';
  } else {
    signupPasswordInput.type = 'password';
  }
});

showPasswordLoginBtn.addEventListener('click', () => {
  const loginPasswordInput = document.querySelector('#password-login');
  if (loginPasswordInput.type === 'password') {
    loginPasswordInput.type = 'text';
  } else {
    loginPasswordInput.type = 'password';
  }
});

logoutBtnEl.addEventListener('click', async () => {
  const success = await APIRequest.sendRequestToAPI('/user/logout', 'GET');
  if (success) {
    Alert.displaySuccess('Logging out..', delay);
    window.location.href = '/';
  } else Alert.displayFailure('Something went wrong try again..', delay);
});
