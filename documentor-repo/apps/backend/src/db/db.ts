//
//  db.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 30.01.2025
//

import mongoose from 'mongoose'

// Not for production, only for testing purposes.
// Use .env or system environment variables.
const MONGODB_URI = ''

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("MongoDB connected.") // Debug message
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}