import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

export const validateAuthToken = (allowedUserTypes = []) => {
  return (req, res, next) => {
    try {
      //1- Extraer el token de las cookies
      const { authToken } = req.cookies;

      //2- validar si existen las cookies
      if (!authToken) {
        return res.json({ message: "cookies not found, you must login" });
      }

      //3-Extraemos la información del token
      const decoded = jsonwebtoken.verify(authToken, config.JWT.secret);

      req.user = decoded;

      //4- Verificar el tipo de usuario si puede ingresar o no
      if (!allowedUserTypes.includes(decoded.userType)) {
        return res.json({ message: "Access denied" });
      }

      next();
    } catch (error) {
        console.log("error"+error)
    }
  };
};
