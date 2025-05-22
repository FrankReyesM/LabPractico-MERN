import jsonwebtoken from "jsonwebtoken"; //Token
import bcryptjs from "bcryptjs"; //Encriptar
import nodemailer from "nodemailer"; //Enviar correos
import crypto from "crypto"; // Codigo aleatorio

import clientsModel from "../models/customers.js";
import { config } from "../config.js";

//Array de funciones
const registerClientsController = {};

registerClientsController.register = async (req, res) => {
  //1- Solicitar los datos que vamos a registrar
  const {
    name,
    lastName,
    birthday,
    email,
    password,
    telephone,
    dui,
    isVerified,
  } = req.body;

  try {
    // Verificamos si el cliente ya existe
    const existingClient = await clientsModel.findOne({ email });
    if (existingClient) {
      return res.json({ message: "Client already exist" });
    }

    // Encriptar la contraseña
    const passwordHash = await bcryptjs.hash(password, 10);

    //Guardos el cliente en la base de datos
    const newClient = new clientsModel({
      name,
      lastName,
      birthday,
      email,
      password: passwordHash,
      telephone,
      dui: dui || null,
      isVerified: isVerified || false,
    });

    await newClient.save();

    // Generar un codigo aleatorio para enviarlo por correo
    const verificationCode = crypto.randomBytes(3).toString("hex");

    // Generar un token que contenga el codigo de verficacion
    const tokenCode = jsonwebtoken.sign(
      //1- ¿Que voy a guardar?
      { email, verificationCode },
      //2- Secret key
      config.JWT.secret,
      //3- Cuando expira
      { expiresIn: "2h" }
    );

    res.cookie("verificationToken", tokenCode, { maxAge: 2 * 60 * 60 * 1000 });

    // Enviar el correo electronico
    //1- Transporter => quien lo envia
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.email_user,
        pass: config.email.email_pass,
      },
    });

    //2- mailOption => Quien lo recibe
    const mailOptions = {
      from: config.email.email_user,
      to: email,
      subject: "Verificación de correo",
      text:
        "Para verificar tu cuenta, utiliza el siguiente codigo: " +
        verificationCode +
        "\n expira en dos horas",
    };

    //3- Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.json({ message: "Error sending email" + error });
      }
      console.log("Email sent" + info);
    });

    res.json({
      message: "Client registered, Please verify your email with the code sent",
    });
  } catch (error) {
    console.log("error" + error);
  }
};

registerClientsController.verifyCodeEmail = async (req, res) => {
  const { requireCode } = req.body;

  // Obtengo el token guardado en las cookies
  const token = req.cookies.verificationToken;

  try {
    // Verificar y decodificar el token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const { email, verificationCode: storedCode } = decoded;

    // Comparar el código que envié por correo y está guardado
    // en las cookies, con el código que el usuario
    // está ingresando
    if (requireCode !== storedCode) {
      return res.json({ message: "Invalid code" });
    }

    // Marcamos al cliente como verificado
    const client = await clientsModel.findOne({ email });
    client.isVerified = true;
    await client.save();

    res.clearCookie("verificationToken");

    res.json({ message: "Email verified Successfuly" });
  } catch (error) {
    console.log("error" + error);
  }
};

export default registerClientsController;
