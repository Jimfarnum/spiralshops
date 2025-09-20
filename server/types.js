// Clara Message Types for SPIRAL AI Agent Communication

/**
 * @typedef {Object} ClaraMessage
 * @property {string} to - agent handle, e.g. 'harbor', 'sentry'
 * @property {string} subject
 * @property {'low'|'normal'|'high'} [priority]
 * @property {Record<string, any>} [payload]
 * @property {string} [mallId] - optional: scope to a tenant
 */

/**
 * @typedef {Object} ClaraAck
 * @property {true} ok
 * @property {string} ticketId
 * @property {string} routedTo - agent handle
 */

/**
 * @typedef {Object} ClaraError
 * @property {false} ok
 * @property {string} error
 */

export {};