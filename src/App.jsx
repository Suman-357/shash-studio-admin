import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { OverviewPage } from "./pages/OverviewPage";
import { BatchesPage } from "./pages/BatchesPage";
import { BookingsPage } from "./pages/BookingsPage";
import { InquiriesPage } from "./pages/InquiriesPage";
import { ProductsPage } from "./pages/ProductsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
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
