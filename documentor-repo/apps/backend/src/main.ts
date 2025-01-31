import mongoose from "mongoose"
import http from 'http'
import { registerUser, loginUser } from "./services/user.service"
import { createDocument, deleteDocumentById } from "./services/document.service"

// Only for development purposes, use .env
// or production environment variables
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.PORT || ''

// Connect to MongoDB using mongoose
mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB."))
  .catch(err => console.error("Unable to connect to MongoDB:", err))

const server = http.createServer(async (req, res) => {
  /*
    User register and login methods
  */
  // Registration method
  if (req.method === 'POST' && req.url === "/register") {
    let body = ''
    // Collecting data from the request body
    req.on('data', chunk => body += chunk)
    req.on('end', async () => {
      // Unwrapping and getting username & password
      const { username, password } = JSON.parse(body)
      try {
        // Registering user into DB
        const user = await registerUser(username, password)
        res.writeHead(201, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(user)) // Sending user object as JSON
      } catch (error) {
        // Catching an error when unable to register user 
        res.writeHead(400, { 'Content-Type': 'application/json' })
        // Sending error message as JSON
        res.end(JSON.stringify({ error: error.message }))
        throw new Error(error)
      }
    })
  }
})


server.listen(PORT,)
