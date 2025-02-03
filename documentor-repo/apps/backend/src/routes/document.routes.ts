//
//  document.routes.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 31.01.2025
//

import { registerRoute } from "../lib/router"
import {
  createDocument,
  getDocumentById,
  updateDocumentById,
  deleteDocumentById
} from "../services/document.service"
import UserModel from "../models/user.model"

// Document creation endpoint
registerRoute('POST', '/documents', async (req, res, params, body) => {

  if (!body?.title || !body?.content || !body?.userId) {
    throw { statusCode: 400, message: 'Missing required fields' };
  }

  const newDoc = await createDocument(
    body.title,
    body.content,
    body.userId
  );

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(newDoc));
});

// Fetch documents for a specific user
registerRoute('GET', '/documents/user/:userId', async (req, res, params) => {
  const userId = params.userId

  if (!userId) {
    throw { statusCode: 400, message: 'Missing user ID' }
  }

  // Fetch user and populate 'documents' array
  const user = await UserModel.findById(userId).populate('documents')

  if (!user) {
    throw { statusCode: 404, message: 'User not found' }
  }

  const documents = user.documents || [];
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(documents))
})

registerRoute('GET', '/documents/:id', async (req, res, params) => {
  if (!params.id) throw { statusCode: 400, message: 'Missing document ID' }

  // Fetch requested document by ID and return result
  const result = await getDocumentById(params.id)
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(result))
})

// Update document
registerRoute('PUT', '/documents/:id', async (req, res, params, body) => {
  if (!params.id) {
    throw { statusCode: 400, message: 'Missing document ID' };
  }

  if (!body?.title || !body?.content) {
    throw {
      statusCode: 400,
      message: 'Missing required fields: title or content'
    };
  }

  const updatedDoc = await updateDocumentById(
    params.id,
    body.title,
    body.content
  );

  if (!updatedDoc) {
    throw {
      statusCode: 404,
      message: 'Document not found'
    };
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(updatedDoc));
});

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
  // console.warn('Document deleted:', result.id)
})

