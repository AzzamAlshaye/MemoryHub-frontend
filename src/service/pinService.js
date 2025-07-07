// src/services/pinService.js
import { primaryAPI } from "../api/client";
import { pinEndpoints, userEndpoints } from "../api/endpoints";

export const pinService = {
  /**
   * Create a new pin with up to 10 images and one video.
   */
  createWithMedia(fields, images = [], video = null) {
    const form = new FormData();
    // only append text fields that are not null or undefined
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, String(value));
      }
    });
    if (video) form.append("video", video);
    images.slice(0, 10).forEach((img) => form.append("images", img));

    return primaryAPI
      .post(pinEndpoints.create, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  /**
   * Update a pin with optional media.
   */
  updateWithMedia(id, fields, images = [], video = null) {
    const form = new FormData();
    // only append text fields that are not null or undefined

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, String(value));
      }
    });
    if (video) form.append("video", video);
    images.slice(0, 10).forEach((img) => form.append("images", img));

    return primaryAPI
      .put(pinEndpoints.update(id), form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  /**
   * List all visible pins (with optional filter/search).
   */
  list(filter = "public", search = "") {
    return primaryAPI
      .get(pinEndpoints.list, { params: { filter, search } })
      .then((res) => res.data);
  },

  /**
   * List only the pins created by the authenticated user.
   */
  async listMyPins() {
    try {
      const res = await primaryAPI.get(userEndpoints.listMine);
      if (!Array.isArray(res.data)) {
        console.error("Invalid response from /pins/me:", res.data);
        throw new Error("Expected an array of pins");
      }
      console.log("listMyPins:", res.data); // Debug print
      return res.data;
    } catch (err) {
      console.error("Error fetching my pins:", err);
      throw err;
    }
  },

  /**
   * Get single pin by ID.
   */
  get(id) {
    return primaryAPI.get(pinEndpoints.get(id)).then((res) => res.data);
  },

  /**
   * Delete a pin by ID.
   */
  remove(id) {
    return primaryAPI.delete(pinEndpoints.remove(id)).then((res) => res.data);
  },
};
