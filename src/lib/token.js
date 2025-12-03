// Token management utility for the application
export const getToken = () => {
  return localStorage.getItem("token") || null;
};

export const setToken = (token, role) => {
  localStorage.setItem("token", token);
  if (role) {
    localStorage.setItem("role", role);
  }
};

export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userData");
};

export const getUserRole = () => {
  return localStorage.getItem("role") || null;
};

export const getUserData = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

export const setUserData = (data) => {
  localStorage.setItem("userData", JSON.stringify(data));
};

export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Basic token validation - you can enhance this with JWT decoding if needed
    const parts = token.split('.');
    return parts.length === 3; // Basic JWT structure check
  } catch (error) {
    return false;
  }
};

/**
 * Decode JWT token to extract payload
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Get role from JWT token
 * @returns {string|null} Role from token or null
 */
export const getRoleFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  if (decoded && decoded.role) {
    return decoded.role;
  }
  
  // Fallback to stored role
  return getUserRole();
};