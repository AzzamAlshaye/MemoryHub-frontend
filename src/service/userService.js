// src/services/userService.js
import { primaryAPI } from "../api/client";
import { userEndpoints } from "../api/endpoints";

export const userService = {
  /**
   * @param {string} id
   * @returns {Promise<{id:string, name:string, avatar:string}>}
   */
  getPublic(id) {
    return primaryAPI.get(userEndpoints.getPublic(id)).then((r) => r.data);
  },

  get(id) {
    return primaryAPI.get(userEndpoints.get(id)).then((r) => r.data);
  },

  getCurrentUser() {
    return primaryAPI.get(userEndpoints.me).then((r) => r.data);
  },

  list() {
    return primaryAPI.get(userEndpoints.list).then((r) => r.data);
  },

  updateSelf(data) {
    return primaryAPI.put(userEndpoints.updateSelf, data).then((r) => r.data);
  },

  deleteSelf() {
    return primaryAPI.delete(userEndpoints.deleteSelf).then((r) => r.data);
  },

  uploadSelfAvatar(file) {
    const form = new FormData();
    form.append("avatar", file);
    return primaryAPI
      .patch(userEndpoints.uploadSelfAvatar, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  update(id, data) {
    return primaryAPI.put(userEndpoints.update(id), data).then((r) => r.data);
  },

  remove(id) {
    return primaryAPI.delete(userEndpoints.remove(id)).then((r) => r.data);
  },

  uploadAvatar(id, file) {
    const form = new FormData();
    form.append("avatar", file);
    return primaryAPI
      .patch(userEndpoints.uploadAvatar(id), form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};
