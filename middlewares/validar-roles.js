const { response } = require("express");

const esAdminRole = (req, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "se quiere verificar el role sin validar el toke primero",
    });
  }

  const { rol, nombre } = req.usuario;

  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `El usaurio ${nombre} no es Admin`,
    });
  }

  next();
};

const tieneRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: "se quiere verificar el role sin validar el toke primero",
      });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(401).json({
        msg: `El servicio requiere uno de estos roles ${roles}`,
      });
    }

    next();
  };
};

module.exports = { esAdminRole, tieneRoles };
