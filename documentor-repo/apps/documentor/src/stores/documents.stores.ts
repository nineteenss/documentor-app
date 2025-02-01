//
//  documents.stores.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 01.02.2025
//

import { atom } from 'jotai'

// Atom  to store the list of documents
export const documentsAtom = atom<any[]>([])

// Atom to store the currently selected document
export const currentDocumentAtom = atom<any | null>(null)
