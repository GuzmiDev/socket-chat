const { request, response } = require("express");
const { Categoria } = require("../models");

const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre}, ya existe`,
    });
  }

  //Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);

  await categoria.save();

  res.status(201).json(categoria);
};

const buscarCategoriaId = async (req = request, res = response) => {
  const id = req.params.id;
  const categoria = await Categoria.findById(id).populate("usuario", "nombre");

  res.status(200).json({
    categoria,
  });
};

const mostrarCategorias = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    categorias,
  });
};

const actualizarCategoria = async (req = request, res = response) => {
  const id = req.params.id;

  //SACAMOS ESTADO Y USUARIO PORQUE NO QUEREMOS QUE IMPLIQUE EN LA ACTUALIZACION DE LA CATEGORIA
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const categoriaDB = await Categoria.findByIdAndUpdate(id, data, {
    new: true,
  }).populate("usuario", "nombre");

  res.json({
    categoriaDB,
  });
};

const borrarCategoria = async (req = request, res = response) => {
  const id = req.params.id;
  const categoriaDB = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    {
      new: true,
    }
  );

  res.json({
    categoriaDB,
  });
};

module.exports = {
  crearCategoria,
  buscarCategoriaId,
  mostrarCategorias,
  actualizarCategoria,
  borrarCategoria,
};
