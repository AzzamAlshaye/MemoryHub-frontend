// src/services/likeService.js
import { primaryAPI } from "../api/client";
import { likeEndpoints } from "../api/endpoints";

export const likeService = {
  /**
   * POST /likes
   * @param {{ targetType: string, targetId: string }} data
   * @returns {Promise<Object>}
   */
  create(data) {
    return primaryAPI.post(likeEndpoints.create, data).then((r) => r.data);
  },

  /**
   * GET /likes/:targetType/:targetId
   * @param {string} type
   * @param {string} id
   * @returns {Promise<Array>}
   */
  list(type, id) {
    return primaryAPI.get(likeEndpoints.list(type, id)).then((r) => r.data);
  },

  /**
   * DELETE /likes/:id
   * @param {string} id
   * @returns {Promise<void>}
   */
  remove(id) {
    return primaryAPI.delete(likeEndpoints.remove(id)).then((r) => r.data);
  },
};
