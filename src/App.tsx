import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AppLayout from "./components/layout/AppLayout";

// Lazy loading das páginas
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const Leads = lazy(() => import("./pages/Leads"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Plans = lazy(() => import("./pages/Plans"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LeadCaptureBuilder = lazy(() => import("./components/LeadCaptureBuilder").then(module => ({ default: module.LeadCaptureBuilder })));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>}>
            <Routes>
              {/* Rotas públicas */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              
              {/* Rota de seleção de planos - apenas para usuários com role USER */}
              <Route 
                path="/plans" 
                element={
                  <ProtectedRoute requiredRoles={['USER']}>
                    <Plans />
                  </ProtectedRoute>
                } 
              />
              
              {/* Editor de campanhas - protegido para roles pagas */}
              <Route 
                path="campaigns/edit/:id" 
                element={
                  <ProtectedRoute requiredRoles={['STARTER', 'PRO', 'ADMIN']}>
                    <LeadCaptureBuilder />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rotas principais com layout - protegidas para roles pagas */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute requiredRoles={['STARTER', 'PRO', 'ADMIN']}>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="campaigns" element={<Campaigns />} />
                <Route path="leads" element={<Leads />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
