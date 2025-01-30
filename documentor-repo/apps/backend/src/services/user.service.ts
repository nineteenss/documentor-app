//
//  user.service.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 30.01.2025
//

import bcrypt from 'bcrypt'
import UserModel from '../models/user.model'

// Hash the password with a salt round of 10
const saltRounds = 10

// Function to register a new user
// Passwords are hashed using bcrypt before being saved to the database
export async function registerUser(username: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  // Create a new user
  const user = new UserModel({
    username,
    password: hashedPassword,
    documents: []
  })

  // Save the user to the database
  return await user.save()
}

// Function to log in a user
// Compares the provided password with the hashed password stored in the database
export async function loginUser(username: string, password: string) {
  const user = await UserModel.findOne({ username }) // Find the user by username
  if (!user) throw new Error('User not found') // Throw an error if the user doesn't exist

  // Compare the provided password with the hashed password
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('Invalid credentials')

  // Return the user object if login is successful
  return user
}