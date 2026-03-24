import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'

const app = express()
const PORT = process.env.PORT || 4173
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, 'dist')

app.use(express.static(DIST))

// SPA fallback — all routes serve index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(DIST, 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mumuksha frontend running on http://0.0.0.0:${PORT}`)
})
