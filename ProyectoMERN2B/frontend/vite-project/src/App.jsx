import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductCRUD from "./pages/products/products";
import BlogCRUD from './pages/blog/blog';
import ReviewsCRUD from './pages/reviews/reviews';
import Navbar from './components/navBar';
import HomePage from './components/HomePage';
import './App.css';

function App() {
  
  return (
    <Router>
          <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/blog" element={<BlogCRUD />} />
            <Route path="/reviews" element={<ReviewsCRUD />} />
            <Route path="/productos" element={<ProductCRUD />} />
          </Routes>
    </Router>
  );
}

export default App;