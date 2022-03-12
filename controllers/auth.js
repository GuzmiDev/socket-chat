const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    //Si el correo existe
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });
    }

    //Si el usario está activo

    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado: false",
      });
    }

    //verificar la contraseña

    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario  / Password no son correctos - password",
      });
    }

    //Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Hable con el admiistrador",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, picture, email } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo: email });

    if (!usuario) {
      const data = {
        nombre: name,
        correo: email,
        rol: "USER_ROLE",
        estado: true,
        google: true,
        password: 123,
      };

      usuario = new Usuario(data);
      await usuario.save();
      console.log("object");
    }

    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el admisitrador, usuario bloqueado",
      });
    }

    const token = await generarJWT(usuario.id);

    res.json({
      msg: "todo bien miji",
      token,
      usuario,
    });
  } catch (error) {
    console.error("Error en googleSignin", error);
    return res
      .status(400)
      .json({ ok: false, msg: "El Token no se pudo verificar" });
  }
};

const renovarToken = async (req, res = resposnse) => {
  const { usuario } = req;

  const token = await generarJWT(usuario.id);

  res.json({
    usuario,
    token,
  });
};

module.exports = { login, googleSignIn, renovarToken };
