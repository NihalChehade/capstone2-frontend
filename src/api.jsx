import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

class HomeAutomationApi {
  static token;

  // General request function to handle all API calls
  static async request(endpoint, data = {}, method = "get") {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = {
      Authorization: `Bearer ${HomeAutomationApi.token}`,
      'Content-Type': 'application/json',
    };
    const params = method === "get" ? data : {};

    try {
      const response = await axios({ url, method, data, params, headers });
      return response.data;
    } catch (err) {
      // Check if the server responded with errors and reformat if necessary
      if (err.response && err.response.data.error && err.response.data.error.errors) {
        const errors = {};
        err.response.data.error.errors.forEach(error => {
          // Assume error has a field and message structure
          errors[error.field] = error.message;
        });
        throw errors;
      } else {
        // General error message if no structured errors are provided
        throw { general: err.response ? err.response.data.error.message || "Something went wrong" : "Network error" };
      }
    }
  }

  // API methods
  static async signup(userData) {
    return await this.request('auth/register', userData, 'post');
  }

  static async login(credentials) {
    return await this.request('auth/token', credentials, 'post');
  }

  static async getUser(username) {
    return await this.request(`users/${username}`);
  }

  static async updateProfile(username, userData) {
    return await this.request(`users/${username}`, userData, 'patch');
  }

  static async getDevices() {
    return await this.request('devices');
  }

  static async addADevice(deviceData) {
    return await this.request('devices', deviceData, 'post');
  }

  static async removeADevice(deviceName) {
    return await this.request(`devices/${deviceName}`, {}, 'delete');
  }

  static async controlALight(deviceName, action) {
    return await this.request(`devices/lights/${deviceName}`, action, 'patch');
  }

  static async controlLights(action) {
    return await this.request('devices/lights', action, 'patch');
  }
}

export default HomeAutomationApi;
