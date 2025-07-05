// src/services/userService.js
import { primaryAPI } from "../api/client";
import { userEndpoints } from "../api/endpoints";

export const userService = {
  /**
   * PUT /users/me
   * @param {Object} data - fields to update
   * @returns {Promise<Object>}
   */
  updateSelf(data) {
    return primaryAPI.put(userEndpoints.updateSelf, data).then((r) => r.data);
  },

  /**
   * DELETE /users/me
   * @returns {Promise<void>}
   */
  deleteSelf() {
    return primaryAPI.delete(userEndpoints.deleteSelf).then((r) => r.data);
  },

  /**
   * GET /users
   * @returns {Promise<Array>}
   */
  list() {
    return primaryAPI.get(userEndpoints.list).then((r) => r.data);
  },

  /**
   * GET /users/:id
   * @param {string} id
   * @returns {Promise<Object>}
   */
  get(id) {
    return primaryAPI.get(userEndpoints.get(id)).then((r) => r.data);
  },
  /**
   * GET /api/users/me
   * @returns {Promise<{ id:string, email:string, role:string }>}
   */
  getCurrentUser() {
    return primaryAPI.get(userEndpoints.me).then((res) => res.data);
  },

  /**
   * PUT /users/:id
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update(id, data) {
    return primaryAPI.put(userEndpoints.update(id), data).then((r) => r.data);
  },

  /**
   * DELETE /users/:id
   * @param {string} id
   * @returns {Promise<void>}
   */
  remove(id) {
    return primaryAPI.delete(userEndpoints.remove(id)).then((r) => r.data);
  },
};
