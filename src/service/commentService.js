// src/services/commentService.js
import { primaryAPI } from "../api/client";
import { commentEndpoints } from "../api/endpoints";

export const commentService = {
  /**
   * POST /comments
   * @param {{ pinId: string, text: string }} data
   * @returns {Promise<Object>}
   */
  create({ pinId, text }) {
    if (!pinId || !text) {
      return Promise.reject(
        new Error("pinId and text are required to create a comment")
      );
    }
    // rename to match the Comment model: pin & content
    return primaryAPI
      .post(commentEndpoints.create, { pin: pinId, content: text })
      .then((r) => r.data);
  },

  /**
   * GET /comments/pin/:pinId
   * @param {string} pinId
   * @returns {Promise<Array>}
   */
  listByPin(pinId) {
    if (!pinId) {
      return Promise.reject(new Error("pinId is required to list comments"));
    }
    return primaryAPI
      .get(commentEndpoints.listByPin(pinId))
      .then((r) => r.data);
  },

  /**
   * PUT /comments/:id
   */
  update(id, data) {
    return primaryAPI
      .put(commentEndpoints.update(id), data)
      .then((r) => r.data);
  },

  /**
   * DELETE /comments/:id
   */
  remove(id) {
    return primaryAPI.delete(commentEndpoints.remove(id)).then((r) => r.data);
  },
};