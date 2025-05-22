const logoutController = {};

logoutController.logout = async (req, res) => {
  //Borrar la cookie de "authToken"
  res.clearCookie("authToken");

  return res.json({ message: "Sesión cerrada" });
};

export default logoutController;
