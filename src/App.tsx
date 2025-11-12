import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home-page";
import AdminDashboard from "./components/admin-components";
import AdminLogin from "./pages/admin-login";
import ProtectedAdminRoute from "./components/protected-admin-route";
import { AuthProvider } from "./lib/auth";
import PropertyPage from "./pages/property-page";
import PropertyPreview from "./pages/property-preview";
import ContactUs from "./pages/contact-us";
import SellBuyPage from "./pages/sell-buy-page";
import ServicesPage from "./pages/services-page";
import About from "./pages/about";
import CareersPage from "./pages/careers-page";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - Work exactly as before */}
          <Route path="/" element={<HomePage />} />
          <Route path="/property" element={<PropertyPage />} />
          <Route path="/property/:id" element={<PropertyPreview />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/sell-buy" element={<SellBuyPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<CareersPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<AdminLogin />} />

          {/* Protected Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
