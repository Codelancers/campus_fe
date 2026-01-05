import axios from 'axios';

// =====================================================
// API BASE CONFIG
// =====================================================
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:7080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// =====================================================
// REQUEST INTERCEPTOR (JWT)
// =====================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =====================================================
// USER APIs
// =====================================================
export const registerUser = async (userData) => {
  const res = await api.post('/api/users/register', userData);
  return res.data;
};

export const sendUserOTP = async (email) => {
  const res = await api.post('/api/users/otp', { email });
  return res.data;
};

export const verifyUserOTP = async (email, otp) => {
  const res = await api.post('/api/users/verify', {
    email: email.trim(),
    otp: String(otp).trim(),
  });

  return {
    token: res.data?.token || res.data,
    status: res.status,
    responseData: res.data,
  };
};

export const updateUserProfile = async (userId, userData) => {
  const res = await api.put(`/api/users/${userId}`, userData);
  return res.data;
};

// =====================================================
// ADMIN APIs
// =====================================================
export const registerAdmin = async (adminData) => {
  const res = await api.post('/api/admins/register', adminData);
  return res.data;
};

export const sendAdminOTP = async (email) => {
  const res = await api.post('/api/admins/otp', { email });
  return res.data;
};

export const verifyAdminOTP = async (email, otp) => {
  const res = await api.post('/api/admins/verify', {
    email: email.trim(),
    otp: String(otp).trim(),
  });

  return {
    token: res.data?.token || res.data,
    status: res.status,
    responseData: res.data,
  };
};

export const updateAdminDetails = async (adminId, adminData) => {
  const res = await api.put(`/api/admins/${adminId}`, adminData);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await api.delete(`/api/admins/users/${userId}`);
  return res.data;
};

export const getUsersByDepartment = async (department) => {
  const res = await api.get(`/api/users/department/${department}`);
  return res.data;
};

// =====================================================
// EVENT APIs  ✅ ALWAYS FORM-DATA
// =====================================================
export const createEvent = async (creatorId, eventData) => {
  let payload;

  if (eventData instanceof FormData) {
    payload = eventData;
  } else {
    payload = new FormData();
    Object.keys(eventData).forEach((key) => {
      if (Array.isArray(eventData[key])) {
        eventData[key].forEach((val) => payload.append(key, val));
      } else {
        payload.append(key, eventData[key]);
      }
    });
  }

  const res = await api.post(
    '/api/events/create',
    payload,
    {
      params: { creatorId },
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  return res.data;
};

export const updateEvent = async (eventId, eventData) => {
  const res = await api.put(`/api/events/${eventId}`, eventData);
  return res.data;
};

export const changeEventStatus = async (eventId, status) => {
  const res = await api.put(
    `/api/events/${eventId}/status`,
    null,
    { params: { status } }
  );
  return res.data;
};

export const deleteEvent = async (eventId) => {
  const res = await api.delete(`/api/events/${eventId}`);
  return res.data;
};

export const getAllEvents = async () => {
  const res = await api.get('/api/events/all');
  return res.data;
};

export const applyForEvent = async (eventId, rollNo) => {
  const res = await api.post('/api/registrations/apply', {
    eventId,
    rollNo
  });
  return res.data;
};

// =====================================================
// NOTIFICATION APIs
// =====================================================
export const createNotification = async (data) => {
  const res = await api.post('/api/notifications', data);
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await api.delete(`/api/notifications/${id}`);
  return res.data;
};

export const getAllNotifications = async () => {
  const res = await api.get('/api/notifications');
  return res.data;
};

export default api;
