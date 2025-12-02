// Token management utility for the application
export const getToken = () => {
  return localStorage.getItem("operatortoken") || 
         localStorage.getItem("admintoken") || 
         localStorage.getItem("superadmintoken") || null;
};

export const setToken = (token, role) => {
  // Clear any existing tokens first
  removeToken();
  
  // Set token based on role
  if (role === "OPERATOR") {
    localStorage.setItem("operatortoken", token);
  } else if (role === "ADMIN") {
    localStorage.setItem("admintoken", token);
  } else {
    localStorage.setItem("superadmintoken", token);
  }
};

export const removeToken = () => {
  localStorage.removeItem("superadmintoken");
  localStorage.removeItem("admintoken");
  localStorage.removeItem("operatortoken");
};

export const getUserRole = () => {
  if (localStorage.getItem("operatortoken")) return "OPERATOR";
  if (localStorage.getItem("admintoken")) return "ADMIN";
  if (localStorage.getItem("superadmintoken")) return "SUPERADMIN";
  return null;
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