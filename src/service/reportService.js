import { primaryAPI } from "../api/client";
import { reportEndpoints } from "../api/endpoints";

export const reportService = {
  /**
   * POST /reports
   * @param {{ targetType: string, targetId: string, reason?: string }} data
   * @returns {Promise<Object>}
   */
  create(data) {
    return primaryAPI.post(reportEndpoints.create, data).then((r) => r.data);
  },

  /**
   * GET /reports — returns all reports (you filter client-side)
   * @returns {Promise<Array>}
   */
  list() {
    return primaryAPI.get(reportEndpoints.list).then((r) => r.data);
  },


  listMy() {
    return primaryAPI.get("/reports/my").then((res) => res.data);
  },


  /**
   * PATCH /reports/:id/status
   * @param {string} id
   * @param {string} status
   * @returns {Promise<Object>}
   */
  updateStatus(id, status) {
    return primaryAPI
      .patch(reportEndpoints.updateStatus(id), { status })
      .then((r) => r.data);
  },
};
