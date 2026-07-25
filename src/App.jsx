import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Welcome from "./pages/Welcome";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminClassesPage from "./pages/admin/AdminClassesPage";
import TeacherDashboardPage from "./pages/teacher/TeacherDashboardPage";
import ClassDetailPage from "./pages/teacher/ClassDetailPage";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./pages/admin/Dashboard";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <BrowserRouter>
            <div className="flex min-h-screen">
              <Sidebar />

              <div className="flex min-w-0 flex-1 flex-col">
                <Navbar />

                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 xl:px-16">
                  <div className="mx-auto w-full max-w-7xl">
                    <Routes>
                      <Route path="/" element={<Welcome />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route
                        path="/admin/users"
                        element={
                          <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminUsersPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute allowedRoles={["admin"]}>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/classes"
                        element={
                          <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminClassesPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/teacher"
                        element={
                          <ProtectedRoute allowedRoles={["teacher"]}>
                            <TeacherDashboardPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/teacher/classes/:classId"
                        element={
                          <ProtectedRoute allowedRoles={["teacher"]}>
                            <ClassDetailPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/student"
                        element={
                          <ProtectedRoute allowedRoles={["student"]}>
                            <StudentDashboardPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/me"
                        element={
                          <ProtectedRoute allowedRoles={["admin"]}>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/teacher/me"
                        element={
                          <ProtectedRoute allowedRoles={["teacher"]}>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/student/me"
                        element={
                          <ProtectedRoute allowedRoles={["student"]}>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </div>
                </main>
              </div>
            </div>
          </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
