/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-promise-executor-return */
export class Alert {
  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async displaySuccess(msg, ms) {
    // Create a unique id for the element
    const uniqueId = `success-message`;

    if (document.querySelector('#success-message')) return;
    // Insert the HTML with the unique id
    const htmlEl = `<div
        class="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md top-2 left-2 z-100 fixed"
        id="${uniqueId}"
      >
        <div class="flex items-center justify-center w-12 bg-emerald-500">
          <svg
            class="w-6 h-6 text-white fill-current"
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"
            />
          </svg>
        </div>
  
        <div class="px-4 py-2 -mx-3">
          <div class="mx-3">
            <span class="font-semibold text-emerald-500">Success</span>
            <p class="text-sm text-gray-600">${msg}</p>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', htmlEl);

    // Wait for the specified delay
    await this.delay(ms);

    // Select the element by its unique id and remove it
    const element = document.getElementById(uniqueId);
    if (element) {
      document.body.removeChild(element);
    }
  }

  static async displayFailure(msg, ms) {
    // Create a unique id for the element
    const uniqueId = `failure-message`;

    if (document.querySelector('#failure-message')) return;
    // Insert the HTML with the unique id
    const htmlEl = `<div
        class="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md fixed top-2 left-2 z-100"
         id="${uniqueId}"
      >
        <div class="flex items-center justify-center w-12 bg-red-500">
          <svg
            class="w-6 h-6 text-white fill-current"
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"
            />
          </svg>
        </div>
  
        <div class="px-4 py-2 -mx-3">
          <div class="mx-3">
            <span class="font-semibold text-red-500">Error</span>
            <p class="text-sm text-gray-600">${msg}</p>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', htmlEl);

    // Wait for the specified delay
    await this.delay(ms);

    // Select the element by its unique id and remove it
    const element = document.getElementById(uniqueId);
    if (element) {
      document.body.removeChild(element);
    }
  }
}
