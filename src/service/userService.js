// src/services/userService.js
import { primaryAPI } from "../api/client";
import { userEndpoints } from "../api/endpoints";

export const userService = {
  /**
   * PUT /users/me
   */
  updateSelf(data) {
    return primaryAPI.put(userEndpoints.updateSelf, data).then((r) => r.data);
  },

  /**
   * DELETE /users/me
   */
  deleteSelf() {
    return primaryAPI.delete(userEndpoints.deleteSelf).then((r) => r.data);
  },

  /**
   * GET /users
   */
  list() {
    return primaryAPI.get(userEndpoints.list).then((r) => r.data);
  },

  /**
   * GET /users/:id
   */
  get(id) {
    return primaryAPI.get(userEndpoints.get(id)).then((r) => r.data);
  },

  /**
   * GET /users/me
   */
  getCurrentUser() {
    return primaryAPI.get(userEndpoints.me).then((r) => r.data);
  },

  /**
   * PUT /users/:id
   */
  update(id, data) {
    return primaryAPI.put(userEndpoints.update(id), data).then((r) => r.data);
  },

  /**
   * PATCH /users/me/avatar
   */
  uploadSelfAvatar(file) {
    const form = new FormData();
    form.append("avatar", file);
    return primaryAPI
      .patch(userEndpoints.uploadSelfAvatar, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  /**
   * PATCH /users/:id/avatar  (admin only)
   */
  uploadAvatar(id, file) {
    const form = new FormData();
    form.append("avatar", file);
    return primaryAPI
      .patch(userEndpoints.uploadAvatar(id), form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

 /**
   * DELETE /users/:id
   */
  remove(id) {
    return primaryAPI.delete(userEndpoints.remove(id)).then((r) => r.data);
  },
};
