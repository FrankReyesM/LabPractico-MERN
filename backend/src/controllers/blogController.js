import blogModel from "../models/blog.js";
import { v2 as cloudinary } from "cloudinary";

import { config } from "../config.js";

//1- Configurar cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

// Array de funciones vacio
const blogController = {};

//Select
blogController.getAllBlog = async (req, res) => {
  try {
    const blogs = await blogModel.find();
    res.json(blogs);
  } catch (error) {
    console.log("Error al obtener blogs: " + error);
    res.status(500).json({ message: "Error al obtener blogs", error: error.message });
  }
};

//Guardar
blogController.createBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    let imageUrl = "";

    // Si viene una imagen como URL (desde Cloudinary directamente desde el frontend)
    if (image) {
      imageUrl = image;
    }
    // Si viene un archivo (usando multer)
    else if (req.file) {
      const result = await cloudinary.uploader.upload(
        req.file.path, 
        {
          folder: "public",
          allowed_formats: ["jpg", "png", "jpeg"],
        });
      imageUrl = result.secure_url;
    }

    const newBlog = new blogModel({ title, content, image: imageUrl });
    await newBlog.save();

    res.json({ message: "Blog saved", blog: newBlog });
  } catch (error) {
    console.log("Error al crear blog: " + error);
    res.status(500).json({ message: "Error al crear blog", error: error.message });
  }
};

// Actualizar
blogController.updateBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    let imageUrl = "";

    // Si viene una imagen como URL (desde Cloudinary directamente desde el frontend)
    if (image) {
      imageUrl = image;
    }
    // Si viene un archivo (usando multer)
    else if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, 
        {
          folder: "public",
          allowed_formats: ["jpg", "png", "jpeg"],
        });
      imageUrl = result.secure_url;
    }

    const updatedBlog = await blogModel.findByIdAndUpdate(
      req.params.id,
      { title, content, image: imageUrl },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog no encontrado" });
    }

    res.json({ message: "Blog updated", blog: updatedBlog });
  } catch (error) {
    console.log("Error al actualizar blog: " + error);
    res.status(500).json({ message: "Error al actualizar blog", error: error.message });
  }
};

// Eliminar
blogController.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await blogModel.findByIdAndDelete(req.params.id);
    
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog no encontrado" });
    }

    res.json({ message: "Blog eliminado correctamente", blog: deletedBlog });
  } catch (error) {
    console.log("Error al eliminar blog: " + error);
    res.status(500).json({ message: "Error al eliminar blog", error: error.message });
  }
};

export default blogController;