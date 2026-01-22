


import jwt from 'jsonwebtoken';

export const JWT_SECRET = "Cl4u$Secr3taLl@rg4I4l3at0ri@P3rJWT!2025#";

export function validateUser(req, res, next) {
  const authHeader = req.headers['authorization']; //agafo el header on esta el token

  //comprovem si existeix el token, el separo del indicador i el guardo
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Has d'iniciar sessió" }); //en casa de no tenir token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invàlid" });

    req.user = user; // aquí guardem l'usuari que fa la petició
    next();
  });
}






