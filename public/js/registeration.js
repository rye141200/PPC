/* eslint-disable no-undef */
/* eslint-disable strict */
/* eslint-disable no-useless-escape */

'use strict';

// Helper methods
console.log('Hello from the registeration');
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
const fullNameFieldEl = document.querySelector('#contact-name');
const emailFieldEl = document.querySelector('#contact-email');
const passwordFieldEl = document.querySelector('#contact-password');
const passwordFieldEl2 = document.querySelector('#contact-password2');
const submitBtnEl = document.querySelector('#submit-btn');
const submitErrorEl = document.querySelector('#submit-error');

// event listeners
// fullNameFieldEl.addEventListener('keyup', () =>
//   showValidationIcon(fullNameFieldEl, function (user) {
//     return true;
//   }),
// );

emailFieldEl.addEventListener('keyup', () =>
  showValidationIcon(emailFieldEl, isValidEmail),
);

passwordFieldEl.addEventListener('keyup', () =>
  showValidationIcon(passwordFieldEl, isValidPassword),
);

passwordFieldEl2.addEventListener('keyup', () =>
  showValidationIcon(
    passwordFieldEl2,
    (password) => passwordFieldEl.value === password,
  ),
);

submitBtnEl.addEventListener('click', async (event) => {
  event.preventDefault();

  // Clear previous error messages
  submitErrorEl.textContent = '';

  // Check if fields are empty
  if (
    !fullNameFieldEl.value ||
    !emailFieldEl.value ||
    !passwordFieldEl.value ||
    !passwordFieldEl2.value
  ) {
    submitErrorEl.textContent = 'All fields are required';
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

  if (passwordFieldEl.value !== passwordFieldEl2.value) {
    submitErrorEl.textContent = 'passwords do not match';
    submitErrorEl.style.color = 'red';
    return;
  }

  // Send the request to the server with the email and password
  try {
    const response = await sendRequestToServer('/user/signup', {
      name: fullNameFieldEl.value,
      email: emailFieldEl.value,
      password: passwordFieldEl.value,
    });
    const data = await response.json();

    // Check if the response is successful
    if (data.status !== 'success') {
      submitErrorEl.textContent =
        'Sign up failed. Please check your email and password.';
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
