const db = require("../config/db")

async function findByEmail(email) {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email])
  return rows[0] || null
}

async function create(email, passwordHash) {
  // Comprobamos que el email no esté registrado ya
  const existing = await findByEmail(email)
  if (existing) {
    throw new Error("EMAIL_IN_USE")
  }
  const [result] = await db.query(
    "INSERT INTO users (email, password_hash, role, active) VALUES (?, ?, 0, 1)",
    [email, passwordHash],
  )
  return result.insertId
}

module.exports = { findByEmail, create }
