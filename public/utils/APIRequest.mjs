/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable import/prefer-default-export */
export class APIRequest {
  static async sendRequestToAPI(
    url,
    method,
    body,
    contentType = 'application/json',
    showError = false,
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
      if (showError) console.log(err);
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
      return false;
    }
  }

  static async sendImageFormRequest(url, method, body) {
    try {
      const response = await fetch(url, {
        method,
        body,
      });
      return { ok: response.ok, res: await response.json() };
    } catch (err) {
      return false;
    }
  }

  static async SendRequestAndGetInfo(url, method, body) {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      return { ok: response.ok, res: await response.json() };
    } catch (err) {
      return false;
    }
  }
}
