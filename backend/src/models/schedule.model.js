const db = require("../config/db")

async function findBySupply(supplyId, userId) {
  const [rows] = await db.query(
    `SELECT sch.*
      FROM schedules sch
      JOIN supplies sup
        ON sch.supply_id = sup.id
      WHERE sch.supply_id = ? AND sup.user_id = ?
      ORDER BY scheduled_at ASC`,
    [supplyId, userId],
  )
  return rows
}

async function findByUser(userId) {
  const [rows] = await db.query(
    `SELECT sch.*, sup.name, sup.color
      FROM schedules sch
      JOIN supplies sup
        ON sch.supply_id = sup.id
      WHERE sup.user_id = ?
      ORDER BY sch.scheduled_at ASC`,
    [userId],
  )
  return rows
}

async function updateStatus(id, supplyId, { status, note, taken_at }) {
  const [result] = await db.query(
    `UPDATE schedules
      SET status = ?, note = ?, taken_at = ?
      WHERE id = ? AND supply_id = ?`,
    [status, note, taken_at, id, supplyId],
  )
  return result.affectedRows
}

module.exports = { findBySupply, findByUser, updateStatus }
