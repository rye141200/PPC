/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable import/prefer-default-export */
export class APIRequest {
  static async sendRequestToAPI(
    url,
    method,
    body,
    contentType = 'application/json',
  ) {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': contentType,
        },
        ...(method !== 'GET' &&
          method !== 'DELETE' && { body: JSON.stringify(body) }),
      });
      if (response.ok) return true;
      return false;
    } catch (err) {
      return false;
    }
  }

  static async sendQueryRequest(url, method, body) {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        ...(method !== 'GET' &&
          method !== 'DELETE' && { body: JSON.stringify(body) }),
      });
      if (response.ok) return await response.json();
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
