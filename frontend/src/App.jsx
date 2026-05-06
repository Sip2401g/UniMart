import { BrowserRouter, Navigate, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import CollegeHeadRoute from "./components/CollegeHeadRoute";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddProduct from "./pages/AddProduct";
import MyListings from "./pages/MyListings";
import ProductDetail from "./pages/ProductDetail";
import CollegeAdminPanel from "./pages/CollegeAdminPanel";

const Layout = () => {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className={hideNavbar ? "" : "main-content"}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
          <Route path="/college-admin" element={<CollegeHeadRoute><CollegeAdminPanel /></CollegeHeadRoute>} />
        </Routes>
      </main>
      {!hideNavbar && <Footer />}
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;