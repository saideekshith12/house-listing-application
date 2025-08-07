class Api {
  constructor(url, method = 'GET', data = {}, token = null, isMultipart = false) {
    this.url = url;
    this.method = method.toUpperCase();
    this.data = data;
    this.token = token;
    this.isMultipart = isMultipart; // Add flag to indicate multipart
  }

  async Apihandle() {
    try {
      const headers = {
        'Accept': 'application/json',
      };

      // Only set Content-Type for JSON
      if (!this.isMultipart) {
        headers['Content-Type'] = 'application/json';
      }


      const options = {
        method: this.method,
        headers,
        credentials: 'include',
      };

      // Attach body
      if (this.method !== 'GET') {
        options.body = this.isMultipart
          ? this.data  // Already a FormData object
          : JSON.stringify(this.data);
      }

      const response = await fetch(this.url, options);
      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        throw new Error(`Invalid JSON response: ${text} `, error);
      }

      return data;
    } catch (err) {
      throw new Error(`Fetch failed: ${err.message}`);
    }
  }
}

export default Api;
