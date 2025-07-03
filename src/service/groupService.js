// src/services/groupService.js
import { primaryAPI } from "../api/client";
import { groupEndpoints } from "../api/endpoints";

export const groupService = {
  /**
   * POST /groups
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create(data) {
    return primaryAPI.post(groupEndpoints.create, data).then((r) => r.data);
  },

  /**
   * GET /groups
   * @returns {Promise<Array>}
   */
  list() {
    return primaryAPI.get(groupEndpoints.list).then((r) => r.data);
  },

  /**
   * GET /groups/:id
   * @param {string} id
   * @returns {Promise<Object>}
   */
  get(id) {
    return primaryAPI.get(groupEndpoints.get(id)).then((r) => r.data);
  },

  /**
   * PUT /groups/:id
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update(id, data) {
    return primaryAPI.put(groupEndpoints.update(id), data).then((r) => r.data);
  },

  /**
   * DELETE /groups/:id
   * @param {string} id
   * @returns {Promise<void>}
   */
  remove(id) {
    return primaryAPI.delete(groupEndpoints.remove(id)).then((r) => r.data);
  },

  /**
   * POST /groups/:id/invite
   * @param {string} id
   * @param {string} email
   * @returns {Promise<Object>}
   */
  invite(id, email) {
    return primaryAPI
      .post(groupEndpoints.invite(id), { email })
      .then((r) => r.data);
  },

  /**
   * POST /groups/:id/join
   * @param {string} id
   * @returns {Promise<Object>}
   */
  join(id) {
    return primaryAPI.post(groupEndpoints.join(id)).then((r) => r.data);
  },

  /**
   * POST /groups/:id/kick/:memberId
   * @param {string} id
   * @param {string} memberId
   * @returns {Promise<Object>}
   */
  kickMember(id, memberId) {
    return primaryAPI
      .post(groupEndpoints.kickMember(id, memberId))
      .then((r) => r.data);
  },

  /**
   * POST /groups/:id/promote/:memberId
   * @param {string} id
   * @param {string} memberId
   * @returns {Promise<Object>}
   */
  promote(id, memberId) {
    return primaryAPI
      .post(groupEndpoints.promote(id, memberId))
      .then((r) => r.data);
  },
};
