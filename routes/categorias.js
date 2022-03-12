const { Router } = require("express");
const { check, query } = require("express-validator");
const {
  crearCategoria,
  borrarCategoria,
  buscarCategoriaId,
  mostrarCategorias,
  actualizarCategoria,
} = require("../controllers/categorias");
const { existeCategoriaId } = require("../helpers/db-validators");
const {
  validarCampos,
  validarJWT,
  esAdminRole,
} = require("../middlewares/index");
const router = Router();

//Obtener todas las categorias - publico
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
  mostrarCategorias
);

//Obtener categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "Introduce un id valido").isMongoId(),
    check("id").custom(existeCategoriaId),
    validarCampos,
  ],
  buscarCategoriaId
);

//Crear categoria - privado - cualquier persona con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//Actualizar categoria - privado - cualquier persona con un token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "Introduce un id valido").isMongoId(),
    check("id").custom(existeCategoriaId),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarCategoria
);

//Borrar una categoria - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "Introduce un id valido").isMongoId(),
    check("id").custom(existeCategoriaId),
    esAdminRole,
    validarCampos,
  ],
  borrarCategoria
);

module.exports = router;
