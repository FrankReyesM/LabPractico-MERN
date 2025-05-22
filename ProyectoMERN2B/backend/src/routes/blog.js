import express from "express";
import multer from "multer";
import blogController from "../controllers/blogController.js";

const router = express.Router();

// Configurar una carpeta local que guarde las imágenes
const upload = multer({ dest: "public/" });

// Rutas principales
router
  .route("/")
  .get(blogController.getAllBlog)
  .post(upload.single("image"), blogController.createBlog);

// Rutas con parámetros ID
router
  .route("/:id")
  .put(upload.single("image"), blogController.updateBlog)
  .delete(blogController.deleteBlog);

export default router;