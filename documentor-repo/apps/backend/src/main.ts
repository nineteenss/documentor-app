import http from "http"
import mongoose from "mongoose"
import { router } from "./lib/router"
import fs from "fs"
import path from "path"
import "./routes/auth.routes"
import "./routes/document.routes"

// Only for development purposes, use .env
// or production environment variables
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI || '' // Fixed typo 'PORT' to 'MONGODB_URI'
const ALLOW_ORIGINS = process.env.ALLOW_ORIGINS || '*'

// Connect to MongoDB using mongoose
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Unable to connect MongoDB:', err))

// Static dir path
const STATIC_DIR = path.join(__dirname, "static")

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

  // Static files
  if (req.url && req.url.startsWith("/static/")) {
    const filePath = path.join(STATIC_DIR, req.url.replace("/static/", ""))
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404
        res.end(JSON.stringify({ error: "File not found" }))
      } else {
        // Set the appropriate content type based on the file extension
        const ext = path.extname(filePath);
        const contentType = getContentType(ext);
        res.setHeader("Content-Type", contentType);
        res.end(data);
      }
    })
    return
  }

  // Setup Find-My-Way to work with routing
  router.lookup(req, res)
})

// Helper function to determine the content type
function getContentType(ext: string): string {
  switch (ext) {
    case ".css":
      return "text/css";
    case ".js":
      return "application/javascript";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
