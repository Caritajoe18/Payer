import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { AuthProvider, useAuth } from "../lib/auth";
import StorePage from "./pages/StorePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import PayrollPage from "./pages/PayrollPage";
import UtilitiesPage from "./pages/UtilitiesPage";
import VirtualAccountsPage from "./pages/VirtualAccountsPage";
import CheckoutPage from "./pages/CheckoutPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center bg-[#06070a] text-white/50">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StorePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
          <Route path="/payroll" element={<ProtectedRoute><PayrollPage /></ProtectedRoute>} />
          <Route path="/utilities" element={<ProtectedRoute><UtilitiesPage /></ProtectedRoute>} />
          <Route path="/virtual-accounts" element={<ProtectedRoute><VirtualAccountsPage /></ProtectedRoute>} />
          <Route path="*" element={
            <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#06070a] text-white">
              <h1 className="text-4xl font-semibold">404</h1>
              <p className="text-white/50">Page not found</p>
              <a href="/" className="rounded-full bg-[#dfe66a] px-4 py-2 text-sm font-semibold text-[#111]">Go home</a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
