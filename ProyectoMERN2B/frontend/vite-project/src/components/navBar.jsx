import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageSquare, Package } from 'lucide-react';
import './Components-css/navBar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: Home, path: '/' },
    { id: 'blog', label: 'Blog', icon: BookOpen, path: '/blog' },
    { id: 'reviews', label: 'Reseñas', icon: MessageSquare, path: '/reviews' },
    { id: 'productos', label: 'Productos', icon: Package, path: '/productos' }
  ];

  // Determinar cuál pestaña está activa basada en la URL actual
  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeTab = tabs.find(tab => tab.path === currentPath);
    return activeTab ? activeTab.id : 'inicio';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = getActiveTab() === tab.id;
          
          return (
            <a
              key={tab.id}
              href="#"
              className={`navbar-tab ${isActive ? 'navbar-tab-active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(tab.path);
              }}
            >
              <IconComponent size={18} />
              <span>{tab.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;