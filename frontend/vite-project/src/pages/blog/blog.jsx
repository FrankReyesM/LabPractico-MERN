import React, { useState, useEffect } from "react";
import "./blog.css";
import Navbar from "../../components/navBar";
import toast, { Toaster } from "react-hot-toast";

const BlogCRUD = () => {
  const API = "http://localhost:4000/api/blog";
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(API);
      
      if (!response.ok) {
        throw new Error(`Error al obtener blogs: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Blogs recibidos del servidor:", data);
      setBlogs(data);
    } catch (error) {
      console.error("Error completo al cargar blogs:", error);
      toast.error(`Error al cargar blogs: ${error.message}`);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveBlog = async (e) => {
    e.preventDefault();
    
    if (isEditing) {
      return handleEdit(e);
    }

    if (!title || !content) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    setUploading(true);
    
    try {
      // Crear FormData para enviar archivos y datos
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      
      if (imageFile) {
        formData.append("image", imageFile);
      }

      console.log("Datos a enviar al servidor:", { title, content, hasImage: !!imageFile });

      const response = await fetch(API, {
        method: "POST",
        body: formData, // No se incluye Content-Type header cuando se usa FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error del servidor: ${response.status} - ${errorData.message || 'Error desconocido'}`);
      }

      const data = await response.json();
      console.log("Respuesta del servidor al crear:", data);
      
      toast.success("Blog publicado con éxito");
      await fetchBlogs();
      resetForm();
    } catch (error) {
      console.error("Error completo al publicar blog:", error);
      toast.error(`Error al publicar: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!id) {
      toast.error("ID de blog no válido");
      return;
    }

    try {
      console.log(`Eliminando blog ID: ${id}`);
      
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al eliminar: ${response.status} - ${errorData.message || 'Error desconocido'}`);
      }

      const data = await response.json();
      console.log("Respuesta del servidor al eliminar:", data);

      toast.success("Blog eliminado con éxito");
      await fetchBlogs();
    } catch (error) {
      console.error("Error completo al eliminar blog:", error);
      toast.error(`Error al eliminar: ${error.message}`);
    }
  };

  const updateBlog = async (dataBlog) => {
    console.log("Blog a editar:", dataBlog);
    setId(dataBlog._id);
    setTitle(dataBlog.title);
    setContent(dataBlog.content);
    
    if (dataBlog.image && dataBlog.image.trim() !== "") {
      setImage(dataBlog.image);
      setPreviewImage(dataBlog.image);
      console.log("Imagen cargada para edición:", dataBlog.image);
    } else {
      setImage("");
      setPreviewImage("");
      console.log("No hay imagen para este blog");
    }
    
    setImageFile(null);
    setIsEditing(true); 
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    setUploading(true);
    
    try {
      // Crear FormData para enviar archivos y datos
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      
      // Si hay una nueva imagen, la enviamos
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (image) {
        // Si no hay nueva imagen pero había una imagen anterior, la mantenemos
        formData.append("image", image);
      }

      console.log(`Actualizando blog ID: ${id} con datos:`, { title, content, hasNewImage: !!imageFile });

      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al actualizar: ${response.status} - ${errorData.message || 'Error desconocido'}`);
      }

      const data = await response.json();
      console.log("Respuesta del servidor al actualizar:", data);

      toast.success("Blog actualizado con éxito");
      resetForm();
      await fetchBlogs();
    } catch (error) {
      console.error("Error completo al actualizar blog:", error);
      toast.error(`Error al actualizar: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
  
  const resetForm = () => {
    setId("");
    setTitle("");
    setContent("");
    setImage("");
    setPreviewImage("");
    setImageFile(null);
    setIsEditing(false);
    console.log("Formulario reseteado");
  };

  const cancelEdit = () => {
    resetForm();
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  return (
    <div className="crud-container blog-container">
      <Navbar />
      <h2>📝 Gestión de Blog</h2>
      <div className="form-container">
        <h3>{isEditing ? "Editar Artículo" : "Crear Nuevo Artículo"}</h3>
        <input
          type="text"
          placeholder="Título del artículo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Contenido del artículo"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="6"
        ></textarea>
        
        <div className="image-upload-container">
          <div className="upload-button-container">
            <label className="custom-file-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
              />
              <span>Seleccionar Imagen</span>
            </label>
          </div>
          
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Vista previa" />
              <button 
                type="button" 
                className="remove-image" 
                onClick={() => {
                  setPreviewImage("");
                  setImage("");
                  setImageFile(null);
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>
        
        <div className="button-group">
          <button 
            className="btn-primary" 
            onClick={saveBlog}
            disabled={uploading}
          >
            {uploading ? "Procesando..." : isEditing ? "Actualizar Artículo" : "Publicar Artículo"}
          </button>
          {isEditing && (
            <button className="btn-secondary" onClick={cancelEdit} disabled={uploading}>
              Cancelar
            </button>
          )}
        </div>
      </div>
      
      <div className="blog-list">
        <h3>Artículos Publicados</h3>
        {loading ? (
          <p>Cargando artículos...</p>
        ) : blogs.length === 0 ? (
          <p>No hay artículos publicados</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="blog-item">
              <div className="blog-content">
                <h4 className="blog-title">{blog.title}</h4>
                <p className="blog-excerpt">{truncateText(blog.content, 100)}</p>
                <div className="blog-date">
                  {new Date(blog.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              
              {blog.image && blog.image.trim() !== "" && (
                <div className="blog-image">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    onError={(e) => {
                      console.error("Error cargando imagen:", blog.image);
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150?text=Error+de+imagen";
                    }}
                  />
                </div>
              )}
              
              <div className="blog-actions">
                <button className="btn-secondary" onClick={() => updateBlog(blog)}>
                  Editar
                </button>
                <button className="btn-danger" onClick={() => deleteBlog(blog._id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
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
  );
};

export default BlogCRUD;