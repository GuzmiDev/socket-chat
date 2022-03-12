const { Router } = require("express");
const { check, query } = require("express-validator");
const {
  crearProducto,
  mostrarProductos,
  buscarProductoId,
  borrarProducto,
  actualizarProducto,
} = require("../controllers/productos");
const {
  existeCategoriaId,
  existeProductoId,
} = require("../helpers/db-validators");
const {
  validarCampos,
  validarJWT,
  esAdminRole,
} = require("../middlewares/index");

const router = Router();

//Obtener todas los productos - publico
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
  mostrarProductos
);

//Obtener producto por id - publico
router.get(
  "/:id",
  [
    check("id", "Introduce un id valido").isMongoId(),
    check("id").custom(existeProductoId),
    validarCampos,
  ],
  buscarProductoId
);

//Crear producto - privado - cualquier persona con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "La categoria es obligatorio").not().isEmpty(),
    check("categoria", "esta categoria no existe").isMongoId(),
    check("categoria").custom(existeCategoriaId),
    validarCampos,
  ],
  crearProducto
);

//Actualizar producto - privado - cualquier persona con un token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "Introduce un id valido").isMongoId(),
    check("id", "No existe el producto con este id").custom(existeProductoId),
    check("categoria", "La categoria es obligatorio").not().isEmpty(),
    check("categoria", "esta categoria no existe").isMongoId(),
    check("categoria").custom(existeCategoriaId),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarProducto
);

//Borrar un producto - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "Introduce un id valido").isMongoId(),
    check("id").custom(existeProductoId),
    esAdminRole,
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;
