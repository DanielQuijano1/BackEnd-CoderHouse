import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

export const generateToken = user => {

    const token = jwt.sign({ user }, `${JWT_SECRET}`, { expiresIn: "12h" });
    console.log(token);
    return token;

}

generateToken({
    "_id": "6522e212397eaa88aae7969b",
    "first_name": "Daniel",
    "last_name": "Quijano",
    "age": "29",
    "email": "danielQuijano@abc.com",
    "password": "$2b$13$enrIW647cprxK/U.JAtF3OelrkAVI60hdTztVPXyiOgLqeMAB0TXS",
    "role": "User"
})


export const authToken = (req, res, next) => {
    //Consultar al header para obtener el Token
    const authHeader = req.headers.Authorization

    if (!authHeader) {
        return res.status(401).send({ error: 'Usuario no autenticado' })
    }

    const token = authHeader.split(' ')[1] //Obtengo el token y descarto el Bearer

    jwt.sign(token, `${JWT_SECRET}`, (error, credential) => {
        if (error) {
            return res.status(403).send({ error: 'Usuario no autorizado, token invalido' })
        }
    })

    //Usuario valido
    req.user = credential.user
    next()
}