// src/services/pinService.js
import { primaryAPI } from "../api/client";
import { pinEndpoints } from "../api/endpoints";

export const pinService = {
  /**
   * Create a new pin with up to 10 images and one video.
   * POST /pins
   * @param {Object} fields       – { title, description, privacy, latitude, longitude, groupId? }
   * @param {File[]} images       – up to 10 image files
   * @param {File|null} video     – optional single video file
   * @returns {Promise<Object>}   – the created pin
   */
  createWithMedia(fields, images = [], video = null) {
    const form = new FormData();
    // append text fields
    Object.entries(fields).forEach(([key, value]) => {
      form.append(key, String(value));
    });
    // append video if present
    if (video) {
      form.append("video", video);
    }
    // append images (max 10)
    images.slice(0, 10).forEach((img) => {
      form.append("images", img);
    });

    return primaryAPI
      .post(pinEndpoints.create, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  /**
   * Update an existing pin, optionally replacing or adding media.
   * PUT /pins/:id
   * @param {string} id
   * @param {Object} fields       – fields to update (same as create)
   * @param {File[]} images       – new images to add
   * @param {File|null} video     – new video to replace
   * @returns {Promise<Object>}   – the updated pin
   */
  updateWithMedia(id, fields, images = [], video = null) {
    const form = new FormData();
    // text fields
    Object.entries(fields).forEach(([key, value]) => {
      form.append(key, String(value));
    });
    if (video) {
      form.append("video", video);
    }
    images.slice(0, 10).forEach((img) => {
      form.append("images", img);
    });

    return primaryAPI
      .put(pinEndpoints.update(id), form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  /**
   * List pins visible to the current user.
   * GET /pins?filter=&search=
   * @param {string} filter   – "public" | "private" | "group"
   * @param {string} search
   * @returns {Promise<Array>}
   */
  list(filter = "public", search = "") {
    return primaryAPI
      .get(pinEndpoints.list, { params: { filter, search } })
      .then((res) => res.data);
  },

  /**
   * Get a single pin by ID.
   * GET /pins/:id
   * @param {string} id
   * @returns {Promise<Object>}
   */
  get(id) {
    return primaryAPI.get(pinEndpoints.get(id)).then((res) => res.data);
  },

  /**
   * Remove (delete) a pin.
   * DELETE /pins/:id
   * @param {string} id
   * @returns {Promise<void>}
   */
  remove(id) {
    return primaryAPI.delete(pinEndpoints.remove(id)).then((res) => res.data);
  },
};