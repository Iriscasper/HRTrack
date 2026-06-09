require("dotenv").config()
const express = require("express")
const cors = require("cors")

// Rutas
const authRoutes = require("./routes/auth.routes")
const supplyRoutes = require("./routes/supply.routes")

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

// Ruta de estado de la conexión
app.get("/health", (req, res) => res.json({ status: "ok" }))
app.use("/auth", authRoutes)
app.use("/supplies", supplyRoutes)

app.listen(PORT, () => console.log(`API en puerto ${PORT}`))
