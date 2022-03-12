const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);

    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: "Usuario del token no existe",
      });
    }

    //verificar si el uid está habliitdado
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no válido - usuario false",
      });
    }

    req.usuario = usuario;
    req.uid = uid;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      msg: "Token no válido",
    });
  }
};

module.exports = { validarJWT };
