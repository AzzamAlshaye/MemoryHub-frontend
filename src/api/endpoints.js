// src/api/endpoints.js
// All of these are relative to your primaryAPI.baseURL

// ─── Auth ────────────────────────────────────────────────────────────────
export const authEndpoints = {
  signup: "/auth/signup", // POST   /api/auth/signup
  signin: "/auth/signin", // POST   /api/auth/login
  signout: "/auth/signout", // POST   /api/auth/logout
};

// ─── Users ───────────────────────────────────────────────────────────────
export const userEndpoints = {
  me: "/users/me", // GET /api/users/me
  updateSelf: "/users/me", // PUT    /api/users/me
  deleteSelf: "/users/me", // DELETE /api/users/me
  list: "/users", // GET    /api/users
  get: (id) => `/users/${id}`, // GET    /api/users/:id
  update: (id) => `/users/${id}`, // PUT    /api/users/:id
  remove: (id) => `/users/${id}`, // DELETE /api/users/:id
};

// ─── Pins ────────────────────────────────────────────────────────────────
export const pinEndpoints = {
  create: "/pins", // POST   /api/pins
  list: "/pins", // GET    /api/pins
  get: (id) => `/pins/${id}`, // GET    /api/pins/:id
  update: (id) => `/pins/${id}`, // PUT    /api/pins/:id
  remove: (id) => `/pins/${id}`, // DELETE /api/pins/:id
};

// ─── Comments ───────────────────────────────────────────────────────────
export const commentEndpoints = {
  create: "/comments", // POST   /api/comments
  listByPin: (pinId) => `/comments/pin/${pinId}`, // GET    /api/comments/pin/:pinId
  update: (id) => `/comments/${id}`, // PUT    /api/comments/:id
  remove: (id) => `/comments/${id}`, // DELETE /api/comments/:id
};

// ─── Likes ───────────────────────────────────────────────────────────────
export const likeEndpoints = {
  create: "/likes", // POST   /api/likes
  list: (type, id) => `/likes/${type}/${id}`, // GET    /api/likes/:targetType/:targetId
  remove: (id) => `/likes/${id}`, // DELETE /api/likes/:id
};

// ─── Groups ──────────────────────────────────────────────────────────────
export const groupEndpoints = {
  create: "/groups", // POST   /api/groups
  list: "/groups", // GET    /api/groups
  get: (id) => `/groups/${id}`, // GET    /api/groups/:id
  update: (id) => `/groups/${id}`, // PUT    /api/groups/:id
  remove: (id) => `/groups/${id}`, // DELETE /api/groups/:id
  invite: (id) => `/groups/${id}/invite`, // POST   /api/groups/:id/invite
  join: (id) => `/groups/${id}/join`, // POST   /api/groups/:id/join
  kickMember: (id, m) => `/groups/${id}/kick/${m}`, // POST /api/groups/:id/kick/:memberId
  promote: (id, m) => `/groups/${id}/promote/${m}`, // POST /api/groups/:id/promote/:memberId
};

// ─── Reports ─────────────────────────────────────────────────────────────
export const reportEndpoints = {
  create: "/reports", // POST   /api/reports
  list: "/reports", // GET    /api/reports
  updateStatus: (id) => `/reports/${id}/status`, // PATCH  /api/reports/:id/status
};
