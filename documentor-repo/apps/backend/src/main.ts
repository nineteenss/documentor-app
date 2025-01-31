import http from "http"
import mongoose from "mongoose"
import { router } from "./lib/router"
import "./routes/auth.routes"
import "./routes/document.routes"

// Only for development purposes, use .env
// or production environment variables
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI || '' // Fixed typo 'PORT' to 'MONGODB_URI'
const ALLOW_ORIGINS = process.env.ALLOW_ORIGINS || '*'

// Connect to MongoDB using mongoose
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Unable to connect MongoDB:', err))

// Define server
const server = http.createServer((req, res) => {
  // Setup CORS
  // Set Allow-Origin to any i.e. '*' for development purposes,
  // for production setup exact URL's for backend to work with
  // SRC: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers
  res.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGINS) // Any - for development purposes only
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // SRC: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
  if (req.method === 'OPTIONS') {
    res.statusCode = 204 // No content
    return res.end()
  }

  // Setup Find-My-Way to work with routing
  router.lookup(req, res)
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
