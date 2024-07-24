/* eslint-disable no-undef */
/* eslint-disable strict */
/* eslint-disable no-useless-escape */

'use strict';

// Helper methods

const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const disallowedChars = /[\/;:'"\[\]{}\\+\-\(\)]/;
  return emailPattern.test(email) && !disallowedChars.test(email);
};

const isValidPassword = (password) => {
  if (password.length < 8) {
    return false;
  }
  const disallowedChars = /[\/;:'"\[\]{}\\+\-\(\)]/;
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

const showValidationIcon = function (field, isValid) {
  if (isValid(field.value)) {
    if (field.nextElementSibling) {
      if (field.nextElementSibling.outerHTML.includes('incorrect')) {
        field.nextElementSibling.outerHTML = `<i class="status-icon fa-solid fa-circle-check correct"></i>`;
      }
    } else {
      field.insertAdjacentHTML(
        'afterend',
        `<i class="status-icon fa-solid fa-circle-check correct"></i>`,
      );
    }
  } else if (field.nextElementSibling) {
    if (field.nextElementSibling.outerHTML.includes('correct')) {
      field.nextElementSibling.outerHTML = `<i class="status-icon fa-solid fa-circle-xmark incorrect"></i>`;
    }
  } else {
    field.insertAdjacentHTML(
      'afterend',
      `<i class="status-icon fa-solid fa-circle-xmark incorrect"></i>`,
    );
  }
};

// initializers
const emailFieldEl = document.querySelector('#contact-email');
const passwordFieldEl = document.querySelector('#contact-password');
const submitBtnEl = document.querySelector('#submit-btn');
const submitErrorEl = document.querySelector('#submit-error');

// event handlers
emailFieldEl.addEventListener('keyup', () =>
  showValidationIcon(emailFieldEl, isValidEmail),
);

passwordFieldEl.addEventListener('keyup', () =>
  showValidationIcon(passwordFieldEl, isValidPassword),
);

// Event listener for the submit button
submitBtnEl.addEventListener('click', async (event) => {
  event.preventDefault();

  // Clear previous error messages
  submitErrorEl.textContent = '';

  // Check if fields are empty
  if (!emailFieldEl.value || !passwordFieldEl.value) {
    submitErrorEl.textContent = 'Email and Password fields cannot be empty';
    return;
  }

  // Validate email
  if (!isValidEmail(emailFieldEl.value)) {
    submitErrorEl.textContent = 'Invalid email format';
    submitErrorEl.style.color = 'red';
    return;
  }

  // Validate password
  if (!isValidPassword(passwordFieldEl.value)) {
    submitErrorEl.textContent =
      'Password must be at least 8 characters and not contain disallowed characters';
    submitErrorEl.style.color = 'red';
    return;
  }

  // Send the request to the server with the email and password
  try {
    const response = await sendRequestToServer('/user/login', {
      email: emailFieldEl.value,
      password: passwordFieldEl.value,
    });
    const data = await response.json();

    // Check if the response is successful
    if (data.status !== 'success') {
      submitErrorEl.textContent =
        'Login failed. Please check your email and password.';
      submitErrorEl.style.color = 'red';
      return;
    }

    // Redirect to market page on success
    console.log('Success!');
    // window.location.href = '/market'; // Uncomment to enable redirection
  } catch (error) {
    console.error('Error:', error);
    submitErrorEl.textContent = 'An error occurred. Please try again later.';
    submitErrorEl.style.color = 'red';
  }
});

console.log('Hello world from the login.js!');
