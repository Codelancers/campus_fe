import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import "@/App.css";

// Auth Pages
import Login from "@/pages/auth/Login";
import OTPVerification from "@/pages/auth/OTPVerification";
import StudentSignup from "@/pages/auth/StudentSignup";
import AdminLogin from "@/pages/auth/AdminLogin";
import AdminOTPVerification from "@/pages/auth/AdminOTPVerification";
import AdminSignup from "@/pages/auth/AdminSignup";

// Student Pages
import StudentDashboard from "@/pages/student/Dashboard";
import StudentProfile from "@/pages/student/Profile";
import EventsCatalog from "@/pages/student/EventsCatalog";
import EventDetails from "@/pages/student/EventDetails";
import MyCertificates from "@/pages/student/MyCertificates";
import StudentNotifications from "@/pages/student/Notifications";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProfile from "@/pages/admin/Profile";
import EventManagement from "@/pages/admin/EventManagement";
import CreateEvent from "@/pages/admin/CreateEvent";
import EditEvent from "@/pages/admin/EditEvent";
import UserManagement from "@/pages/admin/UserManagement";
import CertificateManagement from "@/pages/admin/CertificateManagement";
import AdminNotifications from "@/pages/admin/Notifications";

// Common Pages
import PageUnderConstruction from "@/pages/common/PageUnderConstruction";

// Layouts
import StudentLayout from "@/layouts/StudentLayout";
import AdminLayout from "@/layouts/AdminLayout";

/**
 * Mock auth hook using localStorage.
 * Replace this later with real auth (JWT, API, etc).
 *
 * token  => user is authenticated
 * role   => "student" | "admin"
 */
const useAuth = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "ADMIN" or "STUDENT"

  return {
    isAuthenticated: !!token,
    isAdmin: role === "ADMIN" || role === "admin",
    user: token ? { role } : null,
  };
};

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    // If user is not admin, push them to student dashboard
    return <Navigate to="/student" replace />;
  }

  return children;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<StudentSignup />} />
          <Route path="/verify-otp" element={<OTPVerification />} />

          {/* Admin Auth Routes */}
          <Route path="/admin123/login" element={<AdminLogin />} />
          <Route path="/admin123/signup" element={<AdminSignup />} />
          <Route path="/admin123/verify-otp" element={<AdminOTPVerification />} />

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="events" element={<EventsCatalog />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="certificates" element={<MyCertificates />} />
            <Route path="notifications" element={<StudentNotifications />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="under-construction" element={<PageUnderConstruction />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="events/create" element={<CreateEvent />} />
            <Route path="events/edit/:id" element={<EditEvent />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="certificates" element={<CertificateManagement />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="under-construction" element={<PageUnderConstruction />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
