//
//  auth.routes.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 31.01.2025
//

import { registerRoute } from "../lib/router"
import { registerUser, loginUser } from "../services/user.service"

// Register endpoint
registerRoute('POST', '/auth/register', async (req, res, _params, body) => {
  // If there's no username or password in the body, throw status code 400
  // with 'Missing credentials' message
  if (!body?.username || !body?.password) {
    throw { statusCode: 400, message: 'Missing credentials' }
  }

  // Register user to DB using credentials
  const user = await registerUser(body.username, body.password)
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(user))
  // Debug
  console.warn('User registered:', user.id)
})

// Login endpoint
registerRoute('POST', '/auth/login', async (req, res, _params, body) => {
  // If there's no username or password in the body, throw status code 400
  // with 'Missing credentials' message
  if (!body?.username || !body?.password) {
    throw { statusCode: 400, message: 'Missing credentials' }
  }

  // Login user using credentials
  const user = await loginUser(body.username, body.password)
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(user))
  // Debug
  console.warn('User logged in:', user.id)
})