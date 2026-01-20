/**
 * @class ApiResponse
 * @description Standardizes all API responses.
 * Ensures the 'Next Guy' always knows the shape of the response.
 */
export class ApiResponse {
  constructor(statusCode, message, data = null, success = true) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success;
    this.timestamp = new Date().toISOString();
  }

  static success(res, statusCode, message, data) {
    return res.status(statusCode).json(new ApiResponse(statusCode, message, data, true));
  }

  static error(res, statusCode, message, error = null) {
    // In production, we might log the full error internally but send a clean message to the user
    return res.status(statusCode).json(new ApiResponse(statusCode, message, error, false));
  }
}