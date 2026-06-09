const db = require("../config/db")

async function findAllByUser(userId) {
  const [rows] = await db.query("SELECT * FROM supplies WHERE user_id = ?", [
    userId,
  ])
  return rows
}

async function findById(id, userId) {
  const [rows] = await db.query(
    "SELECT * FROM supplies WHERE id = ? AND user_id = ?",
    [id, userId],
  )
  return rows[0] || null
}

async function create(
  userId,
  { name, color, stock, frequency, frequency_type, start_date },
) {
  const date = start_date ? new Date(start_date) : new Date()
  const [result] = await db.query(
    `INSERT INTO supplies
      (user_id, name, color, stock, frequency, frequency_type, start_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, name, color, stock, frequency, frequency_type, date],
  )
  return { id: result.insertId, date }
}

async function update(
  id,
  userId,
  { name, color, stock, frequency, frequency_type, start_date },
) {
  const fields = { name, color, stock, frequency }
  if (start_date) fields.start_date = start_date

  const keys = Object.keys(fields)
  const values = Object.values(fields)

  const query = `UPDATE supplies
      SET ${keys.map((k) => `${k} = ?`).join(", ")}
      WHERE id = ? AND user_id = ?`

  const [result] = await db.query(query, [...values, id, userId])
  return result.affectedRows
}

async function remove(id, userId) {
  const [result] = await db.query(
    "DELETE FROM supplies WHERE id = ? AND user_id = ?",
    [id, userId],
  )
  return result.affectedRows
}

module.exports = { findAllByUser, findById, create, update, remove }
