//
//  documents.stores.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 01.02.2025
//

import { atom } from 'jotai'

// Defining Document interface
export interface Document {
  _id: string; // Unique identifier for the document
  title: string; // Title of the document
  content: object; // Content of the document (JSON object)
  userId: string; // ID of the user who owns the document
}

// Atoms to store Title abd Content
// export const titleAtom = atom<string>('')
// export const contentAtom = atom<object>({})

// Atom to store the list of documents
export const documentsAtom = atom<Document[]>([])

// Atom to store the currently selected document
export const currentDocumentAtom = atom<Document | null>(null)
