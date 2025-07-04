// src/services/commentService.js
import { primaryAPI } from "../api/client";
import { commentEndpoints } from "../api/endpoints";

export const commentService = {
  /**
   * POST /comments
   * @param {Object} data - { pinId, text, ... }
   * @returns {Promise<Object>}
   */
  create(data) {
    return primaryAPI.post(commentEndpoints.create, data).then((r) => r.data);
  },

  /**
   * GET /comments/pin/:pinId
   * @param {string} pinId
   * @returns {Promise<Array>}
   */
  listByPin(pinId) {
    return primaryAPI
      .get(commentEndpoints.listByPin(pinId))
      .then((r) => r.data);
  },

  /**
   * PUT /comments/:id
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update(id, data) {
    return primaryAPI
      .put(commentEndpoints.update(id), data)
      .then((r) => r.data);
  },

  /**
   * DELETE /comments/:id
   * @param {string} id
   * @returns {Promise<void>}
   */
  remove(id) {
    return primaryAPI.delete(commentEndpoints.remove(id)).then((r) => r.data);
  },
};
