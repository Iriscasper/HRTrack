const scheduleModel = require("../models/schedule.model")
const supplyModel = require("../models/supply.model")

async function getByUser(req, res) {
  try {
    const schedules = await scheduleModel.findByUser(req.user.id)
    res.json(schedules)
  } catch (err) {
    console.error("Error en getByUser:", err)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

async function getBySupply(req, res) {
  try {
    const supply = await supplyModel.findById(req.params.supplyId, req.user.id)
    if (!supply) {
      return res.status(404).json({ error: "Suministro no encontrado" })
    }
    const schedules = await scheduleModel.findBySupply(
      req.params.supplyId,
      req.user.id,
    )
    res.json(schedules)
  } catch (err) {
    console.error("Error en getBySupply:", err)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

async function updateStatus(req, res) {
  const { status, note, taken_at } = req.body

  if (!status || !["taken", "missed"].includes(status)) {
    return res.status(400).json({ error: "Estado debe ser taken o missed" })
  }

  try {
    const supply = await supplyModel.findById(req.params.supplyId, req.user.id)
    if (!supply) {
      return res.status(404).json({ error: "Suministro no encontrado" })
    }

    const takenAt =
      status === "taken" ? (taken_at ? new Date(taken_at) : new Date()) : null

    const affected = await scheduleModel.updateStatus(
      req.params.id,
      req.params.supplyId,
      { status, note, taken_at: takenAt },
    )

    if (!affected) {
      return res.status(404).json({ error: "Toma no encontrada" })
    }

    res.json({ message: "Toma actualizada" })
  } catch (err) {
    console.error("Error en updateStatus", err)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

module.exports = { getByUser, getBySupply, updateStatus }
