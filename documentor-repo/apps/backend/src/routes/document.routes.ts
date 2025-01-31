//
//  document.routes.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 31.01.2025
//

import { registerRoute } from "../lib/router"
import { createDocument, deleteDocumentById } from "../services/document.service"

// Document creation endpoint
registerRoute('POST', '/documents', async (req, res, _params, body) => {
  // If there's no title, content or userId in the body, throw status code 400
  // with 'Missing required fields' message
  if (!body?.title || !body?.content || !body?.userId) {
    throw { statusCode: 400, message: 'Missing required fields' }
  }

  // Create new document
  const document = await createDocument(body.title, body.content, body.userId)
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(document))
  // Debug
  console.warn('Document created:', document.id)
})

// Document deletion endpoint
registerRoute('DELETE', '/documents/:id', async (req, res, params) => {
  // If there's no ID document or it's missing for some reason, throw status code 400
  // with 'Missing document ID' message
  if (!params.id) throw { statusCode: 400, message: 'Missing document ID' }

  // Delete selected document
  const result = await deleteDocumentById(params.id)
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(result))
  // Debug
  console.warn('Document deleted:', result.id)
})

