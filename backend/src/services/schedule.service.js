const db = require("../config/db")

// Establecemos los días en 90, para crear tomas a 3 meses vista de forma inicial
function generateDates(startDate, frequency, frequencyType, days = 90) {
  const dates = []
  const end = new Date(startDate)
  end.setDate(end.getDate() + days)

  // Creamos una entrada cada X días
  if (frequencyType === "interval") {
    const intervalDays = parseInt(frequency) // Hacemos parse dado que viene como string
    let current = new Date(startDate)
    while (current <= end) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + intervalDays)
    }
  } else if (frequencyType === "weekdays") {
    const targetDays = frequency.split(",").map(Number) // Separamos la string en substrings y los transformamos en números
    let current = new Date(startDate)
    while (current <= end) {
      if (targetDays.includes(current.getDay())) {
        dates.push(new Date(current))
      }
      current.setDate(current.getDate() + 1)
    }
  }

  return dates
}

async function generateSlots(supplyId, startDate, frequency, frequencyType) {
  const dates = generateDates(startDate, frequency, frequencyType)

  for (const date of dates) {
    // Comprobamos si ya hay una toma registrada para ese día antes de añadir una nueva
    const [existing] = await db.query(
      `SELECT id FROM schedules
        WHERE supply_id = ?
        AND DATE(scheduled_at) = DATE(?)`,
      [supplyId, date],
    )

    if (existing.length === 0) {
      await db.query(
        `INSERT INTO schedules
        (supply_id, scheduled_at, status)
        VALUES (?, ?, "pending")`,
        [supplyId, date],
      )
    }
  }
}

async function deletePending(supplyId) {
  await db.query(
    `DELETE FROM schedules
      WHERE supply_id = ? AND status = "pending"`,
    [supplyId],
  )
}

module.exports = { generateSlots, deletePending }
