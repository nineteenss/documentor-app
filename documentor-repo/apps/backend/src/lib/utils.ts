//
//  utils.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 31.01.2025
//

import { IncomingMessage } from "http"

// Reading request body and parsing it to JSON
export async function parseRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    // Define body
    let body = ''

    // Collecting data from the request body and assigning it to body
    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    // When all the data was read, parsing JSON
    req.on('end', async () => {
      try {
        if (body) {
          // Parse JSON if body is not empty
          resolve(JSON.parse(body))
        } else {
          // Return empty object if body is empty
          resolve({})
        }
      } catch (error) {
        reject({ statusCode: 400, message: 'Invalid JSON' })
        console.error('Invalid JSON error:', error) // Debug message
      }
    })

    // Handle errors
    req.on('error', (error) => {
      reject({ statusCode: 500, message: 'Internal Server Error' })
      console.error('Internal Server Error:', error) // Debug message
    })
  })
}