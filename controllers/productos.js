const { request, response } = require("express");
const { Producto } = require("../models");

const crearProducto = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const { precio, categoria, descripcion, disponible } = req.body;

  const productoDB = await Producto.findOne({ nombre });

  if (productoDB) {
    return res.status(400).json({
      msg: `La categoria ${productoDB.nombre}, ya existe`,
    });
  }

  //Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
    precio,
    categoria,
    descripcion,
    disponible,
  };

  const producto = new Producto(data);

  await producto.save();

  res.status(201).json(producto);
};

const buscarProductoId = async (req = request, res = response) => {
  const id = req.params.id;
  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.status(200).json({
    producto,
  });
};

const mostrarProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    productos,
  });
};

const actualizarProducto = async (req = request, res = response) => {
  const id = req.params.id;

  //SACAMOS ESTADO Y USUARIO PORQUE NO QUEREMOS QUE IMPLIQUE EN LA ACTUALIZACION DE LA CATEGORIA
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const productoDB = await Producto.findByIdAndUpdate(id, data, {
    new: true,
  })
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json({
    productoDB,
  });
};

const borrarProducto = async (req = request, res = response) => {
  const id = req.params.id;
  const productoDB = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    {
      new: true,
    }
  );

  res.json({
    productoDB,
  });
};

module.exports = {
  crearProducto,
  buscarProductoId,
  mostrarProductos,
  actualizarProducto,
  borrarProducto,
};
