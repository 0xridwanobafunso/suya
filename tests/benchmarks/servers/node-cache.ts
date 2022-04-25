import express from 'express'
import { Express, Request, Response, NextFunction } from 'express'
import ResponseTime from 'response-time'

import { Suya } from '../../../src/index'

const app: Express = express()

const Cache = new Suya({
  engine: {
    name: 'node-cache',
  },
})

let mockDB = () => {
  let users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@domain.com',
    },
    {
      id: 2,
      name: 'James Noah',
      email: 'noah@domain.com',
    },
  ]

  // mocking response time to be between 100ms - 600ms
  let randResponseTime = Math.floor(Math.random() * 6 + 1) * 100

  return new Promise((resolve, reject) => {
    return setTimeout(() => {
      resolve(users)
    }, randResponseTime)
  })
}

app.use(ResponseTime())

app.get(
  '/users-with-node-cache',
  Cache.forever(),
  async (req: Request, res: Response, next: NextFunction) => {
    let users = await mockDB()

    res.status(200).json({
      success: true,
      data: {
        users,
      },
      code: 200,
    })
  }
)

app.get(
  '/users-without-node-cache',
  async (req: Request, res: Response, next: NextFunction) => {
    let users = await mockDB()

    res.status(200).json({
      success: true,
      data: {
        users,
      },
      code: 200,
    })
  }
)

const server = app.listen(1000, () =>
  console.log('[NODECACHE]: Server running at http://127.0.0.1:1000')
)

process.on('unhandledRejection', (err: { message: string }, promise) => {
  console.log(`Error: ${err.message}`)

  // close the server
  server.close(async () => {
    // close connection
    await Cache.close()

    process.exit(1)
  })
})
