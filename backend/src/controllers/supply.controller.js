const supplyModel = require("../models/supply.model")

async function getAll(req, res) {
  try {
    const supplies = await supplyModel.findAllByUser(req.user.id)
    res.json(supplies)
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

async function getOne(req, res) {
  try {
    const supply = await supplyModel.findById(req.params.id, req.user.id)
    if (!supply) {
      return res.status(404).json({ error: "Suministro no encontrado" })
    }
    res.json(supply)
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

async function create(req, res) {
  const { name, color, stock, frequency, frequency_type, start_date } = req.body

  if (!name || !color || !frequency || !frequency_type) {
    return res.status(400).json({
      error: "Nombre, color, frecuencia y tipo de frecuencia son obligatorios",
    })
  }

  try {
    const id = await supplyModel.create(req.user.id, {
      name,
      color,
      stock,
      frequency,
      frequency_type,
      start_date,
    })
    res.status(201).json({ message: "Suministro creado", id })
  } catch (err) {
    console.error("Error en create supply:", err)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

async function update(req, res) {
  const { name, color, stock, frequency, start_date } = req.body

  if (!name || !color || !frequency) {
    return res
      .status(400)
      .json({ error: "Nombre, color y frecuencia son obligatorios" })
  }

  try {
    const affected = await supplyModel.update(req.params.id, req.user.id, {
      name,
      color,
      stock,
      frequency,
      start_date,
    })
    if (!affected) {
      return res.status(404).json({ error: "Suministro no encontrado" })
    }
    res.json({ message: "Suministro actualizado" })
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

async function remove(req, res) {
  try {
    const affected = await supplyModel.remove(req.params.id, req.user.id)
    if (!affected) {
      return res.status(404).json({ error: "Suministro no encontrado" })
    }
    res.json({ message: "Suministro eliminado" })
  } catch (err) {
    console.error("Error: ", err)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

module.exports = { getAll, getOne, create, update, remove }
