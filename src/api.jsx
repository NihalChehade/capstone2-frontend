import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

class HomeAutomationApi {
  // the token for interactive with the API will be stored here.
  static token;

  // static async request(endpoint, data = {}, method = "get") {
  //   const url = `${BASE_URL}/${endpoint}`;
  //   const headers = { Authorization: `Bearer ${HomeAutomationApi.token}` };
  //   const params = method === "get" ? data : {};

  //   try {
  //     const response = await axios({ url, method, data, params, headers });
  //     return response.data;
  //   } catch (err) {
  //     console.error("API Error:", err.response);
  //     if (!err.response) {
  //       throw ["Network error or server is unreachable"];
  //     }
  //     let message = err.response.data.error
  //       ? err.response.data.error.message
  //       : "An unexpected error occurred";
  //     throw Array.isArray(message) ? message : [message];
  //   }
  // }

  static async request(endpoint, data = {}, method = "get") {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${HomeAutomationApi.token}` };
    const params = method === "get" ? data : {};

    try {
      const response = await axios({ url, method, data, params, headers });
      return response.data;
    } catch (err) {
      console.error("API Error:", err.response);
      if (!err.response) {
        throw new Error("Network error or server is unreachable");
      }
      // Handle the array of errors and join them into a single message string if needed
      let messages = err.response.data.error?.message || [
        "An unexpected error occurred",
      ];
      throw new Error(messages.join(", "));
    }
  }

  // Individual API routes

  /** signup a new user : { username, password, firstName, lastName, email, lifxToken } => token  */
  static async signup({
    username,
    password,
    firstName,
    lastName,
    email,
    lifxToken,
  }) {
    let res = await this.request(
      "auth/register",
      { username, password, firstName, lastName, email, lifxToken },
      "post"
    );
    return res.token;
  }
  /** login a user : { username, password} => token  */
  static async login({ username, password }) {
    let res = await this.request(`auth/token`, { username, password }, "post");
    return res.token;
  }

  // /** Logout a user */
  // static async logout() {
  //   try {
  //     // Call the logout endpoint
  //     const response = await this.request(`auth/logout`, {}, "post");
  //     return response.data;
  //   } catch (err) {
  //     console.error("Logout Failed:", err);
  //     throw err;
  //   }
  // }

  /** Get a user by username : username => user  */
  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }
  /** Patch a user by username : {userData} => UpdatedUser  */
  static async updateProfile(username, userData) {
    let res = await this.request(`users/${username}`, userData, "patch");
    return res.user;
  }

  /** Get devices for loggedin user. */

  static async getDevices() {
    let res = await this.request(`devices`);
    if (res) {
      return res.devices;
    }
  }

  static async addADevice({ name, serial_number, type, room, status }) {
    let res = await this.request(
      `devices/`,
      { name, serial_number, type, room, status },
      "post"
    );
    return res.device;
  }

  static async removeADevice(deviceName) {
    let res = await this.request(`devices/${deviceName}`, {}, "delete");
    return res;
  }

  static async controlALight(deviceName, action) {
    let res = await this.request(
      `devices/lights/${deviceName}`,
      action,
      "patch"
    );
    return res.message;
  }

  static async controlLights(action) {
    let res = await this.request(`devices/lights`, action, "patch");
    return res.message;
  }
}

export default HomeAutomationApi;
