import React, { useState, useEffect } from "react";
import "./reviews.css";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/navBar";
import { Star, MessageSquare, User, Edit, Trash2, Plus, X } from "lucide-react";

const ReviewsCRUD = () => {
  const API = "http://localhost:4000/api/reviews";
  const [id, setId] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const [idClient, setIdClient] = useState("");
  const [nameReviewer, setNameReviewer] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Error al obtener las reseñas");
      const data = await response.json();
      setReviews(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar reseñas");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const saveReview = async (e) => {
    e.preventDefault();
    
    if (isEditing) {
      return handleEdit(e);
    }

    if (!comment || !rating || !nameReviewer) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    const newReview = {
      comment,
      rating: parseInt(rating, 10),
      nameReviewer,
    };

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) throw new Error("Error al registrar la reseña");
      
      toast.success("Reseña registrada con éxito");
      fetchReviews();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar la reseña");
    }
  };

  const deleteReview = async (id) => {
    if (!id) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Error al eliminar la reseña");

      toast.success("Reseña eliminada con éxito");
      fetchReviews();
    } catch (error) {
      console.error("Error al eliminar reseña:", error);
      toast.error("Error al eliminar la reseña");
    }
  };

  const updateReview = async (dataReview) => {
    setId(dataReview._id);
    setComment(dataReview.comment);
    setRating(dataReview.rating);
    setNameReviewer(dataReview.nameReviewer);
    setIsEditing(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!comment || !rating || !nameReviewer) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    const editReview = {
      comment,
      rating: parseInt(rating, 10),
      nameReviewer,
    };

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editReview),
      });

      if (!response.ok) throw new Error("Error al actualizar la reseña");

      toast.success("Reseña actualizada con éxito");
      resetForm();
      fetchReviews();
    } catch (error) {
      console.error("Error al editar reseña:", error);
      toast.error("Error al editar reseña");
    }
  };
  
  const resetForm = () => {
    setId("");
    setComment("");
    setRating("");
    setNameReviewer("");
    setIsEditing(false);
  };

  const cancelEdit = () => {
    resetForm();
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? "star-filled" : "star-empty"}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="reviews-crud-container">
      <div className="reviews-crud-wrapper">
                <Navbar />
        <h2 className="reviews-title">
          <MessageSquare size={32} className="title-icon" />
          Gestión de Reseñas
        </h2>

        <div className="form-container">
          <h3 className="form-title">
            {isEditing ? <Edit size={20} /> : <Plus size={20} />}
            {isEditing ? "Editar Reseña" : "Agregar Nueva Reseña"}
          </h3>

          <textarea
            className="comment-textarea"
            placeholder="Escribe tu comentario aquí..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
          />

          <div className="input-row">
            <select
              className="rating-select"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">Selecciona una calificación</option>
              <option value="1">⭐ 1 - Muy malo</option>
              <option value="2">⭐⭐ 2 - Malo</option>
              <option value="3">⭐⭐⭐ 3 - Regular</option>
              <option value="4">⭐⭐⭐⭐ 4 - Bueno</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 - Excelente</option>
            </select>

            <input
              className="client-input"
              type="text"
              placeholder="Tu nombre"
              value={nameReviewer}
              onChange={(e) => setNameReviewer(e.target.value)}
            />
          </div>

          <div className="button-group">
            <button className="btn-primary" onClick={saveReview}>
              {isEditing ? <Edit size={16} /> : <Plus size={16} />}
              {isEditing ? "Actualizar Reseña" : "Agregar Reseña"}
            </button>
            {isEditing && (
              <button className="btn-cancel" onClick={cancelEdit}>
                <X size={16} />
                Cancelar
              </button>
            )}
          </div>
        </div>
        
        <div className="reviews-list">
          {loading ? (
            <p className="loading-text">Cargando reseñas...</p>
          ) : reviews.length === 0 ? (
            <p className="empty-text">No hay reseñas registradas</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <div className="review-user-info">
                    <div className="user-name">
                      <User size={18} className="user-icon" />
                      <span>{review.nameReviewer?.name || `Reseña de: ${review.nameReviewer}`}</span>
                    </div>
                    <div className="rating-stars">
                      {renderStars(review.rating)}
                      <span className="rating-number">({review.rating}/5)</span>
                    </div>
                  </div>
                  <span className="review-date">{formatDate(review.createdAt)}</span>
                </div>
                
                <p className="review-comment">"{review.comment}"</p>
                
                <div className="review-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => updateReview(review)}
                  >
                    <Edit size={14} />
                    Editar
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => deleteReview(review._id)}
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}

          <Toaster 
        position="top-right" 
        toastOptions={{ 
          duration: 2000,
          style: {
            background: '#333',
            color: '#fff',
            fontWeight: 500
          },
        }} 
        />
        </div>
      </div>
    </div>
  );
};

export default ReviewsCRUD;