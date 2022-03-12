const { Router } = require("express");
const { check } = require("express-validator");
const {
  cargarArchivo,
  obtenerImagen,
  actualizarImagenCloudinary,
} = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers/");
const { validarArchivoSubir } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post("/", [validarArchivoSubir], cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    validarArchivoSubir,
    check("id", "Debe ser un id valido").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  actualizarImagenCloudinary
);

router.get(
  "/:coleccion/:id",
  [
    check("id", "Debe ser un id valido").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  obtenerImagen
);

module.exports = router;
