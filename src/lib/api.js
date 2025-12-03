import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:7080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    // Don't add token for auth endpoints (login, register, OTP)
    const isAuthEndpoint = config.url?.includes('/otp') || 
                          config.url?.includes('/verify') || 
                          config.url?.includes('/register');
    
    if (!isAuthEndpoint) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== USER APIs ====================

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.phone - User's phone number
 * @param {string} userData.department - User's department
 * @param {number} userData.year - User's year
 * @returns {Promise} API response
 */
export const registerUser = async (userData) => {
  const response = await api.post('/api/users/register', userData);
  return response.data;
};

/**
 * Send OTP for user login
 * @param {string} email - User's email
 * @returns {Promise} API response
 */
export const sendUserOTP = async (email) => {
  try {
    const response = await api.post('/api/users/otp', { email });
    
    // Handle string response (like "user not found")
    if (typeof response.data === 'string') {
      const lowerData = response.data.toLowerCase();
      if (lowerData.includes('user not found')) {
        throw new Error('User not found');
      }
    }
    
    return response.data;
  } catch (error) {
    // Handle string error responses
    if (error.response?.data) {
      const errorData = error.response.data;
      if (typeof errorData === 'string') {
        const lowerError = errorData.toLowerCase();
        if (lowerError.includes('user not found')) {
          throw new Error('User not found');
        }
        throw new Error(errorData);
      }
    }
    throw error;
  }
};

/**
 * Verify OTP and get JWT token
 * @param {string} email - User's email
 * @param {string} otp - OTP code
 * @returns {Promise} API response with token
 */
export const verifyUserOTP = async (email, otp) => {
  // Ensure OTP is sent as string and email is trimmed
  const requestBody = {
    email: email.trim(),
    otp: String(otp).trim(),
  };
  
  console.log('User OTP Verification Request:', requestBody);
  
  try {
    const response = await api.post('/api/users/verify', requestBody);
    
    // Handle string response (like "user not found")
    if (typeof response.data === 'string') {
      const lowerData = response.data.toLowerCase();
      if (lowerData.includes('user not found')) {
        throw new Error('User not found');
      }
    }
    
    // Return full response with status and data
    return {
      token: response.data?.token || response.data, // Extracted token
      status: response.status, // HTTP status code
      responseData: response.data, // Original response data (full object with token, user, roles, etc.)
      ...(typeof response.data === 'object' ? response.data : {}), // Spread if object
    };
  } catch (error) {
    // Handle string error responses
    if (error.response?.data) {
      const errorData = error.response.data;
      if (typeof errorData === 'string') {
        const lowerError = errorData.toLowerCase();
        if (lowerError.includes('user not found')) {
          throw new Error('User not found');
        }
        throw new Error(errorData);
      }
    }
    throw error;
  }
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise} API response
 */
export const updateUserProfile = async (userId, userData) => {
  const response = await api.put(`/api/users/${userId}`, userData);
  return response.data;
};

// ==================== ADMIN APIs ====================

/**
 * Register a new admin
 * @param {Object} adminData - Admin registration data
 * @param {string} adminData.name - Admin's name
 * @param {string} adminData.email - Admin's email
 * @returns {Promise} API response
 */
export const registerAdmin = async (adminData) => {
  const response = await api.post('/api/admins/register', adminData);
  return response.data;
};

/**
 * Send OTP for admin login
 * @param {string} email - Admin's email
 * @returns {Promise} API response
 */
export const sendAdminOTP = async (email) => {
  try {
    const response = await api.post('/api/admins/otp', { email });
    
    // Handle string response (like "admin not found")
    if (typeof response.data === 'string') {
      const lowerData = response.data.toLowerCase();
      if (lowerData.includes('admin not found')) {
        throw new Error('Admin not found');
      }
    }
    
    return response.data;
  } catch (error) {
    // Handle string error responses
    if (error.response?.data) {
      const errorData = error.response.data;
      if (typeof errorData === 'string') {
        const lowerError = errorData.toLowerCase();
        if (lowerError.includes('admin not found')) {
          throw new Error('Admin not found');
        }
        throw new Error(errorData);
      }
    }
    throw error;
  }
};

/**
 * Verify admin OTP and get JWT token
 * @param {string} email - Admin's email
 * @param {string} otp - OTP code
 * @returns {Promise} API response with token and status
 */
export const verifyAdminOTP = async (email, otp) => {
  // Ensure OTP is sent as string and email is trimmed
  const requestBody = {
    email: email.trim(),
    otp: String(otp).trim(),
  };
  
  console.log('Admin OTP Verification Request:', requestBody);
  
  try {
    const response = await api.post('/api/admins/verify', requestBody);
    
    // Handle string response (like "admin not found")
    if (typeof response.data === 'string') {
      const lowerData = response.data.toLowerCase();
      if (lowerData.includes('admin not found')) {
        throw new Error('Admin not found');
      }
    }
    
    // Handle both cases:
    // 1. Response is a token string directly: "eyJhbGciOiJIUzI1NiJ9..."
    // 2. Response is an object: { token: "...", admin: {...}, roles: [...] }
    const responseData = response.data;
    const token = typeof responseData === 'string' 
      ? responseData 
      : (responseData?.token || responseData);
    
    // Return full response with status and data
    return {
      token: token, // Extracted token
      status: response.status, // HTTP status code
      responseData: responseData, // Original response data (full object with token, admin, roles, etc.)
      ...(typeof responseData === 'object' ? responseData : {}), // Spread if object
    };
  } catch (error) {
    // Handle string error responses
    if (error.response?.data) {
      const errorData = error.response.data;
      if (typeof errorData === 'string') {
        const lowerError = errorData.toLowerCase();
        if (lowerError.includes('admin not found')) {
          throw new Error('Admin not found');
        }
        throw new Error(errorData);
      }
    }
    throw error;
  }
};

/**
 * Update admin details
 * @param {string} adminId - Admin ID
 * @param {Object} adminData - Updated admin data
 * @returns {Promise} API response
 */
export const updateAdminDetails = async (adminId, adminData) => {
  const response = await api.put(`/api/admins/${adminId}`, adminData);
  return response.data;
};

/**
 * Delete any user (Admin only)
 * @param {string} userId - User ID to delete
 * @returns {Promise} API response
 */
export const deleteUser = async (userId) => {
  const response = await api.delete(`/api/admins/users/${userId}`);
  return response.data;
};

// ==================== EVENT APIs ====================

/**
 * Create a new event
 * @param {string} adminId - Admin ID (creator)
 * @param {Object} eventData - Event data
 * @returns {Promise} API response
 */
export const createEvent = async (adminId, eventData) => {
  const response = await api.post(`/api/events?creatorId=${adminId}`, eventData);
  return response.data;
};

/**
 * Update an event
 * @param {string} eventId - Event ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise} API response
 */
export const updateEvent = async (eventId, eventData) => {
  const response = await api.put(`/api/events/${eventId}`, eventData);
  return response.data;
};

/**
 * Change event status
 * @param {string} eventId - Event ID
 * @param {string} status - New status (e.g., 'COMPLETED')
 * @returns {Promise} API response
 */
export const changeEventStatus = async (eventId, status) => {
  const response = await api.put(`/api/events/${eventId}/status?status=${status}`);
  return response.data;
};

/**
 * Delete an event
 * @param {string} eventId - Event ID
 * @returns {Promise} API response
 */
export const deleteEvent = async (eventId) => {
  const response = await api.delete(`/api/events/${eventId}`);
  return response.data;
};

/**
 * Get all events
 * @returns {Promise} API response with events list
 */
export const getAllEvents = async () => {
  const response = await api.get('/api/events');
  return response.data;
};

// ==================== NOTIFICATION APIs ====================

/**
 * Create a notification
 * @param {Object} notificationData - Notification data
 * @returns {Promise} API response
 */
export const createNotification = async (notificationData) => {
  const response = await api.post('/api/notifications', notificationData);
  return response.data;
};

/**
 * Delete a notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise} API response
 */
export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/api/notifications/${notificationId}`);
  return response.data;
};

/**
 * Get all notifications
 * @returns {Promise} API response with notifications list
 */
export const getAllNotifications = async () => {
  const response = await api.get('/api/notifications');
  return response.data;
};

export default api;

