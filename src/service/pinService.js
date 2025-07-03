// src/services/pinService.js
import { primaryAPI } from "../api/client";
import { pinEndpoints } from "../api/endpoints";

export const pinService = {
  /**
   * POST /pins
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create(data) {
    return primaryAPI.post(pinEndpoints.create, data).then((r) => r.data);
  },

  /**
   * GET /pins
   * @returns {Promise<Array>}
   */
  list() {
    return primaryAPI.get(pinEndpoints.list).then((r) => r.data);
  },

  /**
   * GET /pins/:id
   * @param {string} id
   * @returns {Promise<Object>}
   */
  get(id) {
    return primaryAPI.get(pinEndpoints.get(id)).then((r) => r.data);
  },

  /**
   * PUT /pins/:id
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update(id, data) {
    return primaryAPI.put(pinEndpoints.update(id), data).then((r) => r.data);
  },

  /**
   * DELETE /pins/:id
   * @param {string} id
   * @returns {Promise<void>}
   */
  remove(id) {
    return primaryAPI.delete(pinEndpoints.remove(id)).then((r) => r.data);
  },
};
