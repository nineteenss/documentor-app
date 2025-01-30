//
//  user.model.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 30.01.2025
//

import mongoose, { Schema, Document } from "mongoose"

// Define an interface for the User
// Extending 'Document' ensures that TypeScript knows this object has Mongoose-specific method
interface IUser extends Document {
  username: string
  password: string // Hashed password using 'bcrypt'
  documents: mongoose.Types.ObjectId[]
}

// Defining user schema for User model
const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3
  },
  password: {
    type: String,
    required: true
  },
  documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
})

export default mongoose.model<IUser>('User', userSchema)