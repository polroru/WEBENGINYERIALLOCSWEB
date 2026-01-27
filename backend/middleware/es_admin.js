    // Middleware per comprovar si l'usuari és admin
export function esAdmin(req, res, next) {
  const user = req.user; // si posem la execucio darrera de validate user, podem agafa el user 

    // Si no hi ha user:
  if (!user) {
    return res.status(401).json({ message: "No autenticat" });
  }

    // Comprovem si es admin
  if (user.rol !== 'admin') {
    return res.status(403).json({ message: "Accés denegat, només admins" });
  }

  // Si és admin, deixem passar a la següent funció/ruta
  next();
}
