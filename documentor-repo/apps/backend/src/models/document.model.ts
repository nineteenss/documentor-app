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
  title: string
  content: object // Content of the document, stored as a JSON object
  userId: string
}

// Defining user schema for Document model
const DocumentSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: Object }, // Content isn't required and can remain empty
  userId: { type: String, required: true }
});

export default mongoose.model<IDocument>('Document', DocumentSchema);