import jwt from 'jsonwebtoken';

export const JWT_SECRET = "Cl4u$Secr3taLl@rg4I4l3at0ri@P3rJWT!2025#"; //idealment no hauria d'estar al codi per a que no es vegi a simple vista

export function validateUser(req, res, next) {
  //bearer (al frontend) es un separador, on "avisa" al backend que es el token
  const authHeader = req.headers['authorization']; //agafo el token del valor del header on s'emmagatzema (authorization)
  
  //comprovem si existeix el token, el separo del indicador i el guardo
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Has d'iniciar sessió" }); //en casa de no tenir token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invàlid" });

    req.user = user; // aquí guardem l'usuari que fa la petició
    next();
  });
}






