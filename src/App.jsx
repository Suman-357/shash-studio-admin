import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { OverviewPage } from "./pages/OverviewPage";
import { BatchesPage } from "./pages/BatchesPage";
import { BookingsPage } from "./pages/BookingsPage";
import { InquiriesPage } from "./pages/InquiriesPage";
import { ProductsPage } from "./pages/ProductsPage";
import { LoginPage } from "./pages/LoginPage";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("shash_admin_token"));

  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem("shash_admin_token");
      localStorage.removeItem("shash_admin_user");
      setToken(null);
    };

    window.addEventListener("shash_admin_logout", handleLogout);
    return () => window.removeEventListener("shash_admin_logout", handleLogout);
  }, []);

  if (!token) {
    return <LoginPage onLoginSuccess={(newToken) => setToken(newToken)} />;
  }

  const handleLogout = () => {
    localStorage.removeItem("shash_admin_token");
    localStorage.removeItem("shash_admin_user");
    setToken(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout onLogout={handleLogout} />}>
          <Route index element={<OverviewPage />} />
          <Route path="batches" element={<BatchesPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="inquiries" element={<InquiriesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
