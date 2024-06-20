import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { CartProvider } from './context/CartContext';
import Index from "./pages/Index.jsx";
import Header from "./components/Header.jsx";
import Tools from "./pages/Tools.jsx";

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<Index />} />
          <Route path="/tools" element={<Tools />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;