//
//  router.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 31.01.2025
//

import http from 'http'
import FindMyWay from 'find-my-way'
import { parseRequestBody } from './utils'

// Used this to create a custom router, but there's too complex logic to work on
// so I have desicded to skip it for now
// // type RouteHandler = (
// //   req: http.IncomingMessage,
// //   res: http.ServerResponse,
// //   params: Record<string, string>
// // ) => Promise<void> | void

// // interface Route {
// //   method: string
// //   pathPatter: RegExp
// //   paramNames: string[]
// //   handler: RouteHandler
// // }

// // export class Router {
// //   private routes: Route
// // }

// Using FindMyWay constructor with traditional HTTP/1.x version
// as for TypeScript generic
// SRC: https://www.typescriptlang.org/docs/handbook/2/generics.html
// SRC: https://github.com/delvedor/find-my-way/blob/main/index.d.ts
const router = FindMyWay<FindMyWay.HTTPVersion.V1>({
  defaultRoute: (req, res) => {
    res.statusCode = 404
    res.end(JSON.stringify({ error: 'Not Found' }))
  }
})

export type RouteHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  params: { [key: string]: string | undefined },
  body?: any
) => Promise<void> | void

export function registerRoute(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  handler: RouteHandler
): void {
  router.on(method, path, async (req, res, params) => {
    try {
      // Define body of type 'any'
      let body: any

      if (method === 'POST' || method === 'PUT') {
        body = await parseRequestBody(req)
      }
      await handler(req, res, params, body)
    } catch (error) {
      res.statusCode = error.statusCode || 500
      res.end(JSON.stringify({ error: error.message }))
    }
  })
}

export { router }