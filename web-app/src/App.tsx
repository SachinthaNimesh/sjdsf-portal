// Student = Employee
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import StudentDetail from "./pages/StudentDetail";
import StudentManagement from "./pages/StudentManagement";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ManagerFeedback from "./pages/ManagerFeedback";
import SupervisorManagement from "./pages/SupervisorManagement";
import EmployerManagement from "./pages/EmployerManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <StudentDetail />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-management"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <StudentManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager-feedback"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ManagerFeedback />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/supervisor-management"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SupervisorManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer-management"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <EmployerManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
