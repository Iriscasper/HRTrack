const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")

async function register(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Tanto email como contraseña son obligatorios" })
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "La contraseña debe contener al menos 6 caracteres" })
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10)
    const id = await userModel.create(email, passwordHash)
    res.status(201).json({ message: "Usuario creado", id })
  } catch (err) {
    console.error("Error en el registro:", err)
    if (err.message === "EMAIL_IN_USE") {
      return res
        .status(409) // Conflict
        .json({ error: "El email introducido ya está en uso" })
    }
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Tanto email como contraseña son obligatorios" })
  }

  try {
    const user = await userModel.findByEmail(email)
    if (!user) {
      return res
        .status(401) // Unauthenticated / Unauthorized
        .json({ error: "Credenciales incorrectas" })
    }

    if (!user.active) {
      return res
        .status(403) // Forbidden
        .json({ error: "Cuenta desactivada" })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: "Credenciales incorrectas" })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    )

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    })
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

// Comprobación de que el middleware de jwt funciona
function me(req, res) {
  res.json({ user: req.user })
}

module.exports = { register, login, me }
