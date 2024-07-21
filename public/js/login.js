/* eslint-disable no-useless-escape */
/* eslint-disable strict */

'use strict';


//!Helper methods
const isValidEmail = (email) => {
  // Regular expression for validating an email address
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // List of disallowed characters
  const disallowedChars = /[\/;:'"\[\]{}\\+\-\(\)]/;

  // Check if the email matches the pattern and does not contain disallowed characters
  return emailPattern.test(email) && !disallowedChars.test(email);
};

const isValidPassword = (password) => {
  //? Password must be at least 8 characters long
  if (password.length < 8) {
    return false;
  }

  //? List of disallowed characters
  const disallowedChars = /[\/;:'"\[\]{}\\+\-\(\)]/;

  //? Check if the password does not contain disallowed characters
  return !disallowedChars.test(password);
};

const sendRequestToServer = async (endpoint, body) => {
  const response = await fetch(`${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response;
};
//!SELECTORS
// eslint-disable-next-line no-undef
const loginBtnEl = document.querySelector('#submitBtn');
// eslint-disable-next-line no-undef
const emailFieldEl = document.querySelector('#email');
// eslint-disable-next-line no-undef
const passwordFieldEl = document.querySelector('#password');

//!LISTENERS
loginBtnEl.addEventListener('click', async () => {
  //!1) Checking if fields are empty or not
  if (!emailFieldEl.value || !passwordFieldEl.value) return;

  //!2) Validating the email
  if (!isValidEmail(emailFieldEl.value)) return;

  //!3) Validating the password
  if (!isValidPassword(passwordFieldEl.value)) return;

  //!4) Sending the request to the server with the email and password
  const response = await sendRequestToServer('/user/login', {
    email: emailFieldEl.value,
    password: passwordFieldEl.value,
  });
  const data = await response.json();

  //!5) If response is not ok, show error
  if (data.status !== 'success') return; //TODO SHOW ERROR HERE

  //!6)Redirect to market page 😄
  //TODO
  console.log('Success!');
});
