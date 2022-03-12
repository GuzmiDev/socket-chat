const { Router } = require("express");
const { check, query } = require("express-validator");
const {
  usuariosGet,
  usuariosPost,
  usuariosDelete,
  usuariosPut,
} = require("../controllers/usuarios");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  esRoleValido,
  existeEmail,
  existeUsuarioPorId,
} = require("../helpers/db-validators");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole, tieneRoles } = require("../middlewares/validar-roles");

const router = Router();

router.get(
  "/",
  [
    query("desde", "El valor del query desde debe de ser un valor numérico")
      .if(query("desde").exists())
      .isNumeric(),
    query("limite", "El valor del query limite debe de ser un valor numérico")
      .if(query("limite").exists())
      .isNumeric(),
    validarCampos,
  ],
  usuariosGet
);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    check("nombre", "Debes colocar un nombre").not().isEmpty(),
    check("correo", "El correo no es válido").isEmail(),
    check("password", "La contraseña es muy corta").isLength({ min: 6 }),
    check("rol").custom(esRoleValido),
    check("correo").custom(existeEmail),
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRole,
    tieneRoles("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

module.exports = router;
