/* eslint-disable no-useless-escape */
/* eslint-disable import/prefer-default-export */
export class Validator {
  static isValidEmail(email) {
    // Regular expression for validating an email address
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // List of disallowed characters
    const disallowedChars = /[\/;:'"\[\]{}\\+\-\(\)]/;

    // Check if the email matches the pattern and does not contain disallowed characters
    return emailPattern.test(email) && !disallowedChars.test(email);
  }

  static isValidPassword(password) {
    //? Password must be at least 8 characters long
    if (password.length < 8) return false;

    //? List of disallowed characters
    const disallowedChars = /[\/;:'"\[\]{}\\+\-\(\)]/;

    //? Check if the password does not contain disallowed characters
    return !disallowedChars.test(password);
  }

  static isValidPhoneNumber(field) {
    return /^\d+$/.test(field) && field.length === 9;
  }

  static neutral(element, colorArray) {
    element.classList.remove(...colorArray('red'));
    element.classList.remove(...colorArray('green'));
    element.classList.add(...colorArray('gray'));
  }

  static valid(element, colorArray) {
    element.classList.remove(...colorArray('gray'));
    element.classList.remove(...colorArray('red'));
    element.classList.add(...colorArray('green'));
  }

  static invalid(element, colorArray) {
    element.classList.remove(...colorArray('green'));
    element.classList.remove(...colorArray('gray'));
    element.classList.add(...colorArray('red'));
  }

  static colorArray(color) {
    return [
      `bg-${color}-50`,
      `border-${color}-500`,
      `text-${color}-900`,
      `focus:ring-${color}-500`,
      `focus:border-${color}-500`,
    ];
  }

  static validateField(formBoxesEl) {
    formBoxesEl.forEach((form) =>
      form.addEventListener('input', (e) => {
        const element = e.target;
        if (
          element.getAttribute('id') === 'show-password-login' ||
          element.getAttribute('id') === 'show-password-signup'
        )
          return;
        if (!element.value) this.neutral(element, this.colorArray);
        else if (
          element.getAttribute('type') === 'email' &&
          this.isValidEmail(element.value)
        )
          this.valid(element, this.colorArray);
        else if (
          (element.getAttribute('type') === 'password' ||
            element.getAttribute('name') === 'password') &&
          this.isValidPassword(element.value)
        )
          this.valid(element, this.colorArray);
        else if (
          element.getAttribute('type') === 'text' &&
          element.getAttribute('name') !== 'password' &&
          element.value.length < 30
        )
          this.valid(element, this.colorArray);
        else if (
          element.getAttribute('type') === 'phone' &&
          this.isValidPhoneNumber(element.value)
        )
          this.valid(element, this.colorArray);
        else this.invalid(element, this.colorArray);
      }),
    );
  }
}
