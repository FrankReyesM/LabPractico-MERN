import React, { useState, useEffect } from "react";
import "./products.css";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/navBar";

const ProductCRUD = () => {
  const API = "http://localhost:4000/api/products";
  const [id, setId] = useState("");
  const [nameProduct, setNameProduct] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Error al obtener los productos");
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar productos");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const saveProduct = async (e) => {
    e.preventDefault();
    
    // Si estamos en modo edición, llamamos a handleEdit en su lugar
    if (isEditing) {
      return handleEdit(e);
    }

    if (!nameProduct || !price || !stock) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    const newProduct = {
      name: nameProduct,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
    };

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();

      if (!response.ok) throw new Error("Error al registrar el producto");
      
      toast.success("Producto registrado con éxito");
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar el producto");
    }
  };

  const deleteProduct = async (id) => {
    if (!id) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) throw new Error("Error al eliminar el producto");

      toast.success("Producto eliminado con éxito");
      fetchProducts();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      toast.error("Error al eliminar el producto");
    }
  };

  const updateProduct = async (dataProduct) => {
    setId(dataProduct._id);
    setNameProduct(dataProduct.name);
    setDescription(dataProduct.description);
    setPrice(dataProduct.price);
    setStock(dataProduct.stock);
    setIsEditing(true); // Activamos el modo edición
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!nameProduct || !price || !stock) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    const editProduct = {
      name: nameProduct,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
    };

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProduct),
      });

      const data = await response.json();

      if (!response.ok) throw new Error("Error al actualizar el producto");

      toast.success("Producto actualizado con éxito");
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error al editar producto:", error);
      toast.error("Error al actualizar el producto");
    }
  };
  
  // Función para resetear el formulario
  const resetForm = () => {
    setId("");
    setNameProduct("");
    setDescription("");
    setPrice("");
    setStock("");
    setIsEditing(false);
  };

  // Función para cancelar la edición
  const cancelEdit = () => {
    resetForm();
  };

  return (
    <>
    <div className="crud-container">
      <Navbar />
      <h2>🛍️ Gestión de Productos</h2>
      <div className="form-container">
        <h3>{isEditing ? "Editar Producto" : "Agregar Nuevo Producto"}</h3>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nameProduct}
          onChange={(e) => setNameProduct(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descripción del producto"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <div className="button-group">
          <button className="btn-primary" onClick={saveProduct}>
            {isEditing ? "Actualizar Producto" : "Agregar Producto"}
          </button>
          {isEditing && (
            <button className="btn-secondary" onClick={cancelEdit}>
              Cancelar
            </button>
          )}
        </div>
      </div>
      
      <ul className="product-list">
        {loading ? (
          <p>Cargando productos...</p>
        ) : products.length === 0 ? (
          <p>No hay productos registrados</p>
        ) : (
          products.map((product) => (
            <li key={product._id} className="product-item">
              <div className="product-info">
                <span className="product-name">{product.name}</span>
                {product.description && (
                  <span className="product-description">{product.description}</span>
                )}
              </div>
              <span className="product-price">${product.price}</span>
              <span className="product-stock">Stock: {product.stock}</span>
              <div className="product-actions">
                <button className="btn-secondary" onClick={() => updateProduct(product)}>
                  Actualizar
                </button>
                <button className="btn-danger" onClick={() => deleteProduct(product._id)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
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
    </>
  );
};

export default ProductCRUD;