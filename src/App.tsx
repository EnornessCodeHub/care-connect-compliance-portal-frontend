import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { UserProvider } from "@/contexts/UserContext";
// import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Documents from "./pages/Documents";
import ReceivedDocuments from "./pages/ReceivedDocuments";

// New module imports
import NADOAssistant from "./pages/NADOAssistant";
import Notifications from "./pages/Notifications";
import ViewNotifications from "./pages/ViewNotifications";
import StaffOnboarding from "./pages/StaffOnboarding";
import StaffPerformance from "./pages/StaffPerformance";
import StaffRiskAssessment from "./pages/StaffRiskAssessment";
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
import DocumentTemplates from "./pages/DocumentTemplates";
import DocumentVersions from "./pages/DocumentVersions";
import FormBuilder from "./pages/FormBuilder";
import FormLibrary from "./pages/FormLibrary";
import FormSignatures from "./pages/FormSignatures";
import FormWorkflow from "./pages/FormWorkflow";
import InternalChat from "./pages/InternalChat";
import CommunityBoard from "./pages/CommunityBoard";
import FeatureShowcase from "./pages/FeatureShowcase";
import Team from "./pages/Team";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const AppShell = () => (
  <AppLayout>
    <Outlet />
  </AppLayout>
);

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

            {/* Shell for app */}
            <Route element={<AppShell />}>
              <Route path="/" element={<FeatureShowcase />} />
              <Route path="/showcase" element={<FeatureShowcase />} />
              <Route path="/nado" element={<NADOAssistant />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/notifications/view" element={<ViewNotifications />} />

              {/* Staff Management */}
              <Route path="/team" element={<Team />} />

              {/* Document Center */}
              <Route path="/documents" element={<Documents />} />
              <Route path="/documents/templates" element={<DocumentTemplates />} />
              <Route path="/documents/versions" element={<DocumentVersions />} />
              <Route path="/documents/received" element={<ReceivedDocuments />} />

              {/* Training & Courses */}
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

              {/* Form Builder */}
              <Route path="/forms" element={<FormLibrary />} />
              <Route path="/forms/create" element={<FormBuilder />} />
              <Route path="/forms/signatures" element={<FormSignatures />} />
              <Route path="/forms/workflow" element={<FormWorkflow />} />

              {/* Collaboration */}
              <Route path="/chat" element={<InternalChat />} />
              <Route path="/community" element={<CommunityBoard />} />
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
