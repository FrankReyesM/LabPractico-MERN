import React, { useState, useEffect } from 'react';
import { BookOpen, MessageSquare, Package, TrendingUp, Home, Plus } from 'lucide-react';
import Navbar from './navBar';
import { useNavigate } from 'react-router-dom';
import './Components-css/HomePage.css';

const HomePage = () => {
  const [counts, setCounts] = useState({
    blogs: 0,
    reviews: 0,
    products: 0
  });
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  
  const welcomeMessages = [
    "Buen dia! Bienvenido Profe 👋",
    "¿A que no me la adivina?",
    "Aqui estan los 3 CRUDS completamente funcionales 🎆",
    "Y ADEMAS, conectados a Mongo Atlas 💻",
    "¿Que hace aqui todavia?",
    "Hay botones arriba y abajo, ya los vio? 👁️👁️",
    "Pues parece que no, estan ahi ☝️ y tambien 👇",
    "ehhhh....",
    "Admiro su paciencia.",
    "...",
    "...",
    "de verdad llego hasta aqui?",
    "Como por?",
    "...",
    "pues ni modo, volvamos a empezar",
    "sabia que lo hice perder 1 minuto de su vida?",
    "no? pues ahora si"
  ];

  // Función para obtener los conteos desde tu backend
  const fetchCounts = async () => {
    try {
      console.log('Iniciando fetch de conteos...');
      
      // Hacer las peticiones individualmente para mejor debug
      const blogsResponse = await fetch('http://localhost:4000/api/blog');
      const reviewsResponse = await fetch('http://localhost:4000/api/reviews');
      const productsResponse = await fetch('http://localhost:4000/api/products');

      console.log('Status codes:', {
        blogs: blogsResponse.status,
        reviews: reviewsResponse.status,
        products: productsResponse.status
      });

      const blogsData = await blogsResponse.json();
      const reviewsData = await reviewsResponse.json();
      const productsData = await productsResponse.json();

      console.log('Datos recibidos:', {
        blogsData,
        reviewsData,
        productsData
      });

      setCounts({
        blogs: Array.isArray(blogsData) ? blogsData.length : (blogsData.count || blogsData.length || 0),
        reviews: Array.isArray(reviewsData) ? reviewsData.length : (reviewsData.count || reviewsData.length || 0),
        products: Array.isArray(productsData) ? productsData.length : (productsData.count || productsData.length || 0)
      });

    } catch (error) {
      console.error('Error fetching counts:', error);
      // Valores por defecto en caso de error
      setCounts({
        blogs: 0,
        reviews: 0,
        products: 0
      });
    }
  };

  // Cargar conteos al iniciar la aplicación
  useEffect(() => {
    fetchCounts();
  }, []);

  // Animación de mensajes de bienvenida con transición suave
  useEffect(() => {
    const interval = setInterval(() => {
      // Primero hacer fade out
      setIsVisible(false);
      
      setTimeout(() => {
        // Cambiar el mensaje después de la transición de salida
        setCurrentMessageIndex((prevIndex) => 
          (prevIndex + 1) % welcomeMessages.length
        );
        // Hacer fade in
        setIsVisible(true);
      }, 300); // Esperar a que termine la transición de salida
      
    }, 3500);

    return () => clearInterval(interval);
  }, [welcomeMessages.length]);

  const stats = [
    {
      title: "Blogs",
      count: counts.blogs,
      icon: BookOpen,
      bgColor: "stat-blue",
      textColor: "text-blue",
      path: "/blog"
    },
    {
      title: "Reseñas",
      count: counts.reviews,
      icon: MessageSquare,
      bgColor: "stat-green",
      textColor: "text-green",
      path: "/reviews"
    },
    {
      title: "Productos",
      count: counts.products,
      icon: Package,
      bgColor: "stat-purple",
      textColor: "text-purple",
      path: "/productos"
    }
  ];

  return (
    <div className="homepage">
      {/* Card principal con el mismo estilo que las otras páginas */}
      <div className="homepage-card">
        <Navbar />
        
        {/* Header igual que "Gestión de Reseñas" */}
        <div className="homepage-header">
          <Home className="homepage-icon" />
          <h1 className="homepage-title">Panel de Administración</h1>
        </div>

        {/* Mensaje de bienvenida animado */}
        <div className="welcome-section">
          <h2 className={`welcome-title ${isVisible ? 'fade-in' : 'fade-out'}`}>
            {welcomeMessages[currentMessageIndex]}
          </h2>
          <p className="welcome-subtitle">
            Aquí hay un mini resumen del contenido:
          </p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="stats-grid">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={stat.title} 
                className="stat-card"
                onClick={() => navigate(stat.path)}
                style={{ cursor: 'pointer' }}
              >
                <div className="stat-content">
                  <div className="stat-info">
                    <p className="stat-label">{stat.title}</p>
                    <p className="stat-number">{stat.count}</p>
                  </div>
                  <div className={`stat-icon-container ${stat.bgColor}`}>
                    <IconComponent className={`stat-icon ${stat.textColor}`} />
                  </div>
                </div>
                <div className="stat-footer">
                  <div className="stat-status">
                    <TrendingUp className="trend-icon" />
                    <span className="trend-text">Activo</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botones de acción rápida */}
        <div className="quick-actions">
          <button 
            className="action-button"
            onClick={() => navigate('/blog')}
          >
            <Plus className="action-button-icon" />
            Gestionar Blog
          </button>
          <button 
            className="action-button"
            onClick={() => navigate('/reviews')}
          >
            <Plus className="action-button-icon" />
            Gestionar Reseñas
          </button>
          <button 
            className="action-button"
            onClick={() => navigate('/productos')}
          >
            <Plus className="action-button-icon" />
            Gestionar Productos
          </button>
        </div>

        {/* Resumen adicional */}
        <div className="summary-section">
          <h3 className="summary-title">Resumen General</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <h4 className="summary-subtitle">Estado del Sistema</h4>
              <p className="summary-text">
                Hay un total de <strong>{counts.blogs + counts.reviews + counts.products}</strong> registros 
                en la base de datos de mi Mongo Atlas repartidos en los <strong>3 Cruds</strong>.
              </p>
            </div>
            <div className="summary-item">
              <h4 className="summary-subtitle">Acciones Rápidas</h4>
              <p className="summary-text">
                <strong>¿Intuitivo no?</strong> puede usar los <strong>3 botones</strong> para agregar del medio de la pantalla, o desde a <strong>barra de navegacion</strong>.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;