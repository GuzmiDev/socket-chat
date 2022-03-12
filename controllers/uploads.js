const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req, res = response) => {
  const extensionesValidas = ["jpg", "jpeg", "png", "gif"];

  try {
    const nombre = await subirArchivo(
      req.files,
      extensionesValidas,
      "imagenes"
    );
    res.json({ nombre });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const actualizarImagen = async (req, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usauario con el id ${id}`,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usauario con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  //Limpiar imágenes previas
  if (modelo.img) {
    //Hay que borrar la imagen del servidor
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  const extensionesValidas = ["jpg", "jpeg", "png", "gif"];
  const nombre = await subirArchivo(req.files, extensionesValidas, coleccion);
  modelo.img = nombre;

  await modelo.save();

  res.json({ modelo });
};

const actualizarImagenCloudinary = async (req, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usauario con el id ${id}`,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usauario con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  //Limpiar imágenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  modelo.img = secure_url;
  await modelo.save();

  res.json({ modelo });
};

const obtenerImagen = async (req, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usauario con el id ${id}`,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usauario con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  //Limpiar imágenes previas
  if (modelo.img) {
    //Hay que borrar la imagen del servidor
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }

  const pathImgDefault = path.join(__dirname, "../assets/no-image.jpg");

  res.sendFile(pathImgDefault);
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  obtenerImagen,
  actualizarImagenCloudinary,
};
