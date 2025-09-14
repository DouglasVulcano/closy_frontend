import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import Leads from "./pages/Leads";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Plans from "./pages/Plans";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";
import { LeadCaptureBuilder } from "./components/LeadCaptureBuilder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
