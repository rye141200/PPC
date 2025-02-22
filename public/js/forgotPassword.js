/* eslint-disable */
'use-strict';
import { Alert } from '../utils/alerts.mjs';
import { APIRequest } from '../utils/APIRequest.mjs';
import { Validator } from '../utils/Validator.mjs';
//! Selectors

const forgotPassword = document.querySelector('#forgot-password-submit');
//! Helpers
const startTimer = (domElement) => {
  // Timer duration in seconds
  let timeLeft = 60;

  // Find the container where the timer will be inserted
  const container = domElement;

  // Insert the timer element into the container
  container.insertAdjacentHTML(
    'beforeend',
    '<p id="timerText">Resend after 60 seconds</p>',
  );

  // Get the timer text element
  const timerText = container.getElementById('timerText');

  // Update the timer every second
  const timerInterval = setInterval(() => {
    timeLeft--;
    // Update the text with the remaining time
    timerText.textContent = `Resend after ${timeLeft} seconds`;

    // Check if the time has run out
    if (timeLeft <= 0) {
      // Clear the interval to stop the timer
      clearInterval(timerInterval);
      // Remove the timer text element
      timerText.remove();
    }
  }, 1000);
};
//! Listeners

// Validator.validateField(document.querySelectorAll('.form'));
export const forgotPasswordModule = () =>
  forgotPassword.addEventListener('click', async (e) => {
    e.preventDefault();
    //! 1) Get the email
    const email = document.querySelector('#email-forgot-password').value;
    if (!Validator.isValidEmail(email))
      return Alert.displayFailure('Invalid email!', 2000);

    //! 2) Trigger the sending reset password email
    const response = await APIRequest.SendRequestAndGetInfo(
      '/user/forgotPassword',
      'POST',
      {
        email,
      },
    );
    //! 3) De-activate the button for 1 min
    if (response.ok) {
      const forgotPasswordButton = document.getElementById(
        'forgot-password-submit',
      );
      let countdown = 60;

      // Save the original button content
      const originalButtonContent = forgotPasswordButton.innerHTML;

      // Disable the button and start the countdown timer
      forgotPasswordButton.disabled = true;

      const timerInterval = setInterval(() => {
        forgotPasswordButton.innerHTML = `Please wait... ${countdown}s`;
        countdown--;

        // When countdown reaches 0, reset the button
        if (countdown < 0) {
          clearInterval(timerInterval); // Stop the timer
          forgotPasswordButton.innerHTML = originalButtonContent; // Restore original content
          forgotPasswordButton.disabled = false; // Enable the button again
        }
      }, 1000); // Update the countdown every second
    } else await Alert.displayFailure(response.res.message, 2000);
  });
