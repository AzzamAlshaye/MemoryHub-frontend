// src/services/likeService.js
import { primaryAPI } from "../api/client";
import { likeEndpoints } from "../api/endpoints";

export const likeService = {
  /**
   * POST /likes
   * @param {{ targetType: string, targetId: string, type: "like" | "dislike" }} data
   * @returns {Promise<Object>}
   */
  create(data) {
    return primaryAPI.post(likeEndpoints.create, data).then((r) => r.data);
  },

  /**
   * GET /likes/:targetType/:targetId
   * @param {string} targetType
   * @param {string} targetId
   * @returns {Promise<{likes: number, dislikes: number}>}
   */
  list(targetType, targetId) {
    return primaryAPI
      .get(likeEndpoints.list(targetType, targetId))
      .then((r) => r.data);
  },

  /**
   * GET /likes/:targetType/:targetId/me
   * @param {string} targetType
   * @param {string} targetId
   * @returns {Promise<{ type: "like"|"dislike" } | null>}
   */
  getMyReaction(targetType, targetId) {
    return primaryAPI
      .get(likeEndpoints.getMy(targetType, targetId))
      .then((r) => r.data);
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