// src/services/pinService.js

import { primaryAPI } from "../api/client";
import { pinEndpoints } from "../api/endpoints";

export const pinService = {
  /**
   * POST /pins with a FormData payload (fields + images + optional video).
   * Axios/browser will set the multipart Content-Type boundary for you.
   *
   * @param {FormData} formData
   * @returns {Promise<Object>}  – the created pin
   */
  createWithFormData(formData) {
    return primaryAPI
      .post(pinEndpoints.create, formData)
      .then((res) => res.data);
  },

  /**
   * Create a new pin with up to 10 images and one video.
   * Builds FormData under the hood.
   * POST /pins
   * @param {Object} fields       – { title, description, privacy, latitude, longitude, groupId? }
   * @param {File[]} images       – up to 10 image files
   * @param {File|null} video     – optional single video file
   * @returns {Promise<Object>}   – the created pin
   */
  createWithMedia(fields, images = [], video = null) {
    const form = new FormData();
    // only append text fields that are not null or undefined
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, String(value));
      }
    });
    // append video if present
    if (video) {
      form.append("video", video);
    }
    // append images (max 10)
    images.slice(0, 10).forEach((img) => {
      form.append("images", img);
    });

    return primaryAPI.post(pinEndpoints.create, form).then((res) => res.data);
  },

  /**
   * Update an existing pin, optionally replacing or adding media.
   * PUT /pins/:id
   */
  updateWithMedia(id, fields, images = [], video = null) {
    const form = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, String(value));
      }
    });
    if (video) {
      form.append("video", video);
    }
    images.slice(0, 10).forEach((img) => {
      form.append("images", img);
    });

    return primaryAPI
      .put(pinEndpoints.update(id), form)
      .then((res) => res.data);
  },

  /** List pins visible to the current user. */
  list(filter = "public", search = "") {
    return primaryAPI
      .get(pinEndpoints.list, { params: { filter, search } })
      .then((res) => res.data);
  },

  /** Get a single pin by ID. */
  get(id) {
    return primaryAPI.get(pinEndpoints.get(id)).then((res) => res.data);
  },

  /** Remove (delete) a pin. */
  remove(id) {
    return primaryAPI.delete(pinEndpoints.remove(id)).then((res) => res.data);
  },
};
