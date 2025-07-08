// src/services/groupService.js

import { primaryAPI } from "../api/client";
import { groupEndpoints } from "../api/endpoints";

export const groupService = {
  /**
   * POST /groups
   */
  create(data) {
    return primaryAPI.post(groupEndpoints.create, data).then((r) => r.data);
  },

  /**
   * GET /groups
   */
  list() {
    return primaryAPI.get(groupEndpoints.list).then((r) => r.data);
  },

  /**
   * GET /groups/:id
   */
  get(id) {
    return primaryAPI.get(groupEndpoints.get(id)).then((r) => r.data);
  },

  /**
   * PUT /groups/:id
   */
  update(id, data) {
    return primaryAPI.put(groupEndpoints.update(id), data).then((r) => r.data);
  },

  /**
   * PATCH /groups/:id/avatar
   */
  uploadAvatar(id, file) {
    const form = new FormData();
    form.append("groupAvatar", file);
    return primaryAPI
      .patch(groupEndpoints.uploadAvatar(id), form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  /**
   * DELETE /groups/:id
   */
  remove(id) {
    return primaryAPI.delete(groupEndpoints.remove(id)).then((r) => r.data);
  },

  /**
   * POST /groups/:id/invite
   */
  invite(id) {
    return primaryAPI.post(groupEndpoints.invite(id)).then((r) => r.data);
  },

  /**
   * POST /groups/:id/join?token=…
   */
  join(id, token) {
    return primaryAPI
      .post(groupEndpoints.join(id), null, { params: { token } })
      .then((r) => r.data);
  },

  /**
   * POST /groups/:id/kick/:memberId
   */
  kickMember(id, memberId) {
    return primaryAPI
      .post(groupEndpoints.kickMember(id, memberId))
      .then((r) => r.data);
  },

  /**
   * POST /groups/:id/promote/:memberId
   */
  promote(id, memberId) {
    return primaryAPI
      .post(groupEndpoints.promote(id, memberId))
      .then((r) => r.data);
  },
};
