// src/services/pinService.js
import { primaryAPI } from "../api/client";
import { pinEndpoints, userEndpoints } from "../api/endpoints";

export const pinService = {
  /**
   * Create a new pin with a FormData payload.
   */
  createWithFormData(formData) {
    return primaryAPI
      .post(pinEndpoints.create, formData)
      .then((res) => res.data);
  },

  /**
   * Create a new pin with up to 10 images and one video.
   */
  createWithMedia(fields, images = [], video = null) {
    const form = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, String(value));
      }
    });
    if (video) form.append("video", video);
    images.slice(0, 10).forEach((img) => form.append("images", img));

    return primaryAPI.post(pinEndpoints.create, form).then((res) => res.data);
  },

  /**
   * Update an existing pin, optionally uploading new images/video.
   * Always multipart.
   */
  updateWithMedia(id, fields, images = [], video = null) {
    const form = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, String(value));
      }
    });
    if (video) form.append("video", video);
    images.slice(0, 10).forEach((img) => form.append("images", img));

    return primaryAPI
      .put(pinEndpoints.update(id), form)
      .then((res) => res.data);
  },

  /**
   * Get a single pin by ID.
   */
  get(id) {
    return primaryAPI.get(pinEndpoints.get(id)).then((res) => res.data);
  },

  /**
   * List pins visible to the current user.
   */
  list(filter = "public", search = "", groupId) {
    const params = { filter, search };
    if (filter === "group" && groupId) params.groupId = groupId;
    return primaryAPI
      .get(pinEndpoints.list, { params })
      .then((res) => res.data);
  },

  /**
   * List only the pins created by the authenticated user.
   */
  async listMyPins() {
    const res = await primaryAPI.get(userEndpoints.listMine);
    if (!Array.isArray(res.data)) {
      throw new Error("Expected an array of pins");
    }
    return res.data;
  },

  /**
   * Remove (delete) a pin.
   */
  remove(id) {
    return primaryAPI.delete(pinEndpoints.remove(id)).then((res) => res.data);
  },
};
