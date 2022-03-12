const { Categoria, Producto } = require("../models");
const Role = require("../models/Role");
const Usuario = require("../models/usuario");

const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no es valido`);
  }
};

const existeEmail = async (correo = "") => {
  //Verificar si el correo existe
  const existeEmail = await Usuario.findOne({ correo });

  if (existeEmail) {
    throw new Error(`Este email ya está registrado`);
  }
};

const existeUsuarioPorId = async (id) => {
  //Verificar si el correo existe
  const existeUsuarioPorId = await Usuario.findById(id);

  if (!existeUsuarioPorId) {
    throw new Error(`Este Id no existe`);
  }
};

const existeProductoId = async (id) => {
  const productoId = await Producto.findById(id);

  console.log(id);

  if (!productoId) {
    throw new Error(`No existe producto con el id ${id}`);
  } else if (!productoId.estado) {
    throw new Error(`Ya no existe producto con el id ${id}`);
  }
};
const existeCategoriaId = async (id) => {
  const categoriaId = await Categoria.findById(id);

  if (!categoriaId) {
    throw new Error(`No existe categoria con el id ${id}`);
  } else if (!categoriaId.estado) {
    throw new Error(`Ya no existe categoria con el id ${id}`);
  }
};

const coleccionesPermitidas = async (coleccion = "", colecciones = []) => {
  const incluida = colecciones.includes(coleccion);

  if (!incluida) {
    throw new Error(
      `La colección ${coleccion} no es permitida, se requiere una de estas: ${colecciones}`
    );
  }
};

module.exports = {
  esRoleValido,
  existeEmail,
  existeUsuarioPorId,
  existeCategoriaId,
  existeProductoId,
  coleccionesPermitidas,
};
