import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/home";
import Products from "./pages/ProductListing/ProductListing";
import LoginPage from "./pages/Login/LoginPage";
import Profile from "./pages/Profile/Profile";
import Blog from "./pages/Blog/Blog";
import About from "./pages/About/About";
import { CartProvider } from "./components/CartContext";
import { AuthProvider } from "./auth/AuthContext";
import CartSidebar from "./components/cartSidebar";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<Products />} />

              <Route path="/profile" element={<Profile />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/about" element={<About />} />
            </Routes>
            <CartSidebar />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
