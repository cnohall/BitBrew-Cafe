import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./components/Layout";
import { AppProvider } from "./context/AppContext"; // Adjust path as needed
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';

function AppRoutes() {
  return (
    <Layout>
      <div className="transition-screen w-full py-4 sm:py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/payment" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          {/* Redirect any unknown routes to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Layout>
  );
}

export default function BitBrewCafe() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}