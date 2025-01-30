//
//  document.service.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 30.01.2025
//

import DocumentModel from '../models/document.model'
import UserModel from '../models/user.model'

// Function to create a new document
// The document is saved to the database, and its ID is added to the user's 'documents' array
export async function createDocument(title: string, content: object, userId: string) {
  // Create a new document
  const document = new DocumentModel({ documentTitle: title, documentContent: content })
  const savedDocument = await document.save() // Save the document to the database

  // Update the user's 'documents' array with the new document's ID
  await UserModel.findByIdAndUpdate(userId, { $push: { documents: savedDocument._id } })

  // Return the saved document
  return savedDocument
}

// Function to delete a document by its ID
export async function deleteDocumentById(documentId: string) {
  // Delete the document from the database
  return await DocumentModel.findByIdAndDelete(documentId)
}