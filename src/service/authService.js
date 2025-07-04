// src/services/authService.js
import { primaryAPI } from "../api/client";
import { authEndpoints } from "../api/endpoints";

export const authService = {
  /**
   * POST /api/auth/signup
   * @param {{ email:string, password:string, role?:string }} data
   * @returns {Promise<{ token:string }>}
   */
  signup(data) {
    return primaryAPI.post(authEndpoints.signup, data).then((res) => res.data);
  },

  /**
   * POST /api/auth/login
   * @param {{ email:string, password:string }} creds
   * @returns {Promise<{ token:string }>}
   */
  signin(creds) {
    return primaryAPI.post(authEndpoints.signin, creds).then((res) => res.data);
  },

  /**
   * POST /api/auth/logout
   * @returns {Promise<void>}
   */
  signout() {
    return primaryAPI.post(authEndpoints.signout).then((res) => res.data);
  },
};
