import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/home";
import Products from "./pages/ProductListing/ProductListing";
import { CartProvider } from "./components/CartContext";
import CartSidebar from "./components/cartSidebar";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
          </Routes>

          <CartSidebar />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
