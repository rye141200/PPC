/*eslint-disable */
/* eslint-disable no-useless-escape */
('use-strict');

import { Alert } from '../utils/alerts.mjs';
import { Validator } from '../utils/Validator.mjs';
import { APIRequest } from '../utils/APIRequest.mjs';
import { Cart } from '../utils/Cart.mjs';

//****** (1) AUTHENTICATION ******
//! Selectors
const showPasswordLoginBtn = document.querySelector('#show-password-login');
const formBoxesEl = document.querySelectorAll('.form');
const logoutBtnEl = document.querySelector('#logout-btn');
const showPasswordSignupBtn = document.querySelector('#show-password-signup');
const cartBtnEl = document.querySelector('#user-menu-button');
const loginFormEl = document.querySelector('#login-form');
const signupFormEl = document.querySelector('#signup-form');

const loggedIn =
  !document?.querySelector('#user-menu-button')?.classList.contains('hidden') ??
  null;
const delay = 3000;

//! Helper methods

const login = async () => {
  const loginEmailInput = document.querySelector('#email-login');
  const loginPasswordInput = document.querySelector('#password-login');
  //* 1) Checking if fields are empty or not
  if (!loginEmailInput.value || !loginPasswordInput.value)
    return await Alert.displayFailure('Empty fields required', delay);

  //* 2) Validating the email and the password
  if (
    !Validator.isValidEmail(loginEmailInput.value) ||
    !Validator.isValidPassword(loginPasswordInput.value)
  )
    return await Alert.displayFailure('Invalid email or password', delay);

  //* 3) Send the request
  const resObj = await APIRequest.SendRequestAndGetInfo('/user/login', 'POST', {
    email: loginEmailInput.value,
    password: loginPasswordInput.value,
  });

  //* 4) Check for successful login and redirect
  if (resObj.ok) {
    Alert.displaySuccess('Logged in successfully', delay);
    window.location.href = '/';
  } else Alert.displayFailure(resObj.res.message, delay);
};

const signup = async () => {
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
  const response = await APIRequest.SendRequestAndGetInfo(
    '/user/signup',
    'POST',
    {
      name: signupNameInput.value,
      email: signupEmailInput.value,
      password: signupPasswordInput.value,
      phone: `+966${signupPhoneInput.value}`,
    },
  );

  //* 7) Checking if successful or not and redirecting
  if (response.ok) {
    Alert.displaySuccess('Signed up successfully..', delay);
    if (Cart.loadCart().length !== 0) await transferCart();
    window.location.href = '/';
  } else Alert.displayFailure(response.res.message, delay);
};
//! Listeners
export const authenticationModule = () => {
  if (!loggedIn && Cart.loadCart().length === 0)
    cartBtnEl.setAttribute('href', '');

  Validator.validateField(formBoxesEl);

  loginFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    login();
  });

  signupFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    signup();
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
    const response = await APIRequest.sendRequestToAPI('/user/logout', 'GET');
    if (response) {
      Alert.displaySuccess('Logging out..', delay);
      Cart.clearCart();
      window.location.href = '/';
    } else Alert.displayFailure('Something went wrong!', delay);
  });
  document.addEventListener('DOMContentLoaded', function () {
    Cart.handleCartCount();
  });

  // Function to create and start an observer for a given input and validation text
  function createObserver(inputElement, validationTextElement) {
    const observer = new MutationObserver(function (mutationsList) {
      for (const mutation of mutationsList) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          // Check the current border color based on the class
          if (inputElement.classList.contains('border-green-500')) {
            validationTextElement.classList.add('hidden'); // Hide the text
          } else {
            validationTextElement.classList.remove('hidden'); // Show the text
          }
        }
      }
    });

    // Observe the input for class attribute changes
    observer.observe(inputElement, { attributes: true });
  }

  // Get elements
  const signupNameInput = document.querySelector('#signup-name');
  const nameValidationText = document.querySelector(
    '#username-validation-text',
  );
  const signupEmailInput = document.querySelector('#signup-email');
  const emailValidationText = document.querySelector('#email-validation-text');
  const signupPasswordInput = document.querySelector('#signup-password');
  const passwordValidationText = document.querySelector(
    '#password-validation-text',
  );
  const signupPhoneInput = document.querySelector('#signup-phone');
  const phoneValidationText = document.querySelector('#phone-validation-text');

  // Create observers for each input
  createObserver(signupNameInput, nameValidationText);
  createObserver(signupEmailInput, emailValidationText);
  createObserver(signupPasswordInput, passwordValidationText);
  createObserver(signupPhoneInput, phoneValidationText);
};
