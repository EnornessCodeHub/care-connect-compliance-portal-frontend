import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { UserProvider } from "@/contexts/UserContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import authService from '@/services/authService';

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// NADO AI Assistant
import NADOAssistant from "./pages/NADOAssistant";

// Staff Management
import Staff from "./pages/Staff";

// Notifications
import Notifications from "./pages/Notifications";
import ViewNotifications from "./pages/ViewNotifications";

// Internal Chat
import InternalChat from "./pages/InternalChat";

// Training & Courses
import Training from "./pages/Training";
import TrainingProgress from "./pages/TrainingProgress";
import TrainingCertificates from "./pages/TrainingCertificates";
import TrainingLibrary from "./pages/TrainingLibrary";
import CourseManage from "./pages/CourseManage";
import CourseForm from "./pages/CourseForm";
import CourseContent from "./pages/CourseContent";
import ChapterManage from "./pages/ChapterManage";
import LessonManage from "./pages/LessonManage";
import ChapterForm from "./pages/ChapterForm";
import LessonForm from "./pages/LessonForm";

// Document Center
import Documents from "./pages/Documents";
import DocumentTemplates from "./pages/DocumentTemplates";
import DocumentVersions from "./pages/DocumentVersions";
import ReceivedDocuments from "./pages/ReceivedDocuments";

// E-Signature Documents
import FormBuilder from "./pages/FormBuilder";
import FormLibrary from "./pages/FormLibrary";
import FormSignatures from "./pages/FormSignatures";

// Profile
import Profile from "./pages/Profile";

// Authentication
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import OTPVerification from "./pages/OTPVerification";
import ResetPassword from "./pages/ResetPassword";

// Public Share
import PublicShare from "./pages/PublicShare";

const queryClient = new QueryClient();

const AppShell = () => (
  <AppLayout>
    <Outlet />
  </AppLayout>
);

// Protected route component for admin-only routes
const AdminRoute = ({ children }: { children: React.ReactElement }) => {
  if (authService.isAdmin()) {
    return children;
  }
  return <Navigate to="/" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/share/:token" element={<PublicShare />} />

            {/* Protected Routes - Shell for app */}
            <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
              {/* Dashboard */}
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Index />} />

              {/* NADO AI Assistant */}
              <Route path="/nado" element={<NADOAssistant />} />

              {/* Staff Management */}
              <Route 
                path="/staff" 
                element={
                  <AdminRoute>
                    <Staff />
                  </AdminRoute>
                } 
              />
              <Route path="/team" element={<Staff />} /> {/* Redirect old route */}

              {/* Notifications */}
              <Route 
                path="/notifications" 
                element={
                  <AdminRoute>
                    <Notifications />
                  </AdminRoute>
                } 
              />
              <Route path="/notifications/view" element={<ViewNotifications />} />

              {/* Internal Chat */}
              <Route path="/chat" element={<InternalChat />} />

              {/* Training & Courses */}
              <Route path="/course" element={<Training />} />
              <Route 
                path="/course/progress" 
                element={
                  <AdminRoute>
                    <TrainingProgress />
                  </AdminRoute>
                } 
              />
              <Route path="/course/certificates" element={<TrainingCertificates />} />
              <Route path="/course/library" element={<TrainingLibrary />} />
              <Route path="/course/manage" element={<CourseManage />} />
              <Route path="/course/create" element={<CourseForm />} />
              <Route path="/course/edit/:id" element={<CourseForm />} />
              {/* Dynamic routes must come after static routes */}
              <Route path="/course/:id/chapters/:chapterId/lessons/:lessonId/edit" element={<LessonForm />} />
              <Route path="/course/:id/chapters/:chapterId/lessons" element={<LessonManage />} />
              <Route path="/course/:id/chapters/:chapterId/edit" element={<ChapterForm />} />
              <Route path="/course/:id/chapters" element={<ChapterManage />} />
              <Route path="/course/:id" element={<CourseContent />} />
              {/* Legacy training routes - redirect to course */}
              <Route path="/training" element={<Training />} />
              <Route path="/training/progress" element={<TrainingProgress />} />
              <Route path="/training/certificates" element={<TrainingCertificates />} />
              <Route path="/training/library" element={<TrainingLibrary />} />
              <Route path="/training/manage" element={<CourseManage />} />
              <Route path="/training/create" element={<CourseForm />} />
              <Route path="/training/edit/:id" element={<CourseForm />} />
              <Route path="/training/course/:id" element={<CourseContent />} />
              <Route path="/training/:id/chapters" element={<ChapterManage />} />
              <Route path="/training/:id/chapters/:chapterId/edit" element={<ChapterForm />} />
              <Route path="/training/:id/chapters/:chapterId/lessons" element={<LessonManage />} />
              <Route path="/training/:id/chapters/:chapterId/lessons/:lessonId/edit" element={<LessonForm />} />

              {/* Document Center */}
              <Route path="/documents" element={<Documents />} />
              <Route path="/documents/templates" element={<DocumentTemplates />} />
              <Route path="/documents/versions" element={<DocumentVersions />} />
              <Route path="/documents/received" element={<ReceivedDocuments />} />

              {/* E-Signature Documents */}
              <Route path="/forms" element={<FormLibrary />} />
              <Route path="/forms/create" element={<FormBuilder />} />
              <Route 
                path="/forms/templates" 
                element={
                  <AdminRoute>
                    <FormSignatures />
                  </AdminRoute>
                } 
              />
              <Route path="/forms/sign/:id" element={<FormLibrary />} />

              {/* Profile */}
              <Route path="/profile" element={<Profile />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
