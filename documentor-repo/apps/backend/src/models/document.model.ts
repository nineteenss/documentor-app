//
//  document.model.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 30.01.2025
//

import mongoose, { Schema, Document } from 'mongoose'

// Define an interface for the Document
// Extending 'Document' ensures that TypeScript knows this object has Mongoose-specific methods
export interface IDocument extends Document {
  documentTitle: string
  documentContent: object // Content of the document, stored as a JSON object
}

// Defining user schema for Document model
const DocumentSchema: Schema = new Schema({
  documentTitle: { type: String, required: true },
  documentContent: { type: Object } // Content isn't required and can remain empty
});

export default mongoose.model<IDocument>('Document', DocumentSchema);