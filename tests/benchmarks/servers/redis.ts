import express from 'express'
import { Express, Request, Response, NextFunction } from 'express'
import ResponseTime from 'response-time'

import { Suya } from '../../../src/index'

const app: Express = express()

const Cache = new Suya({
  engine: {
    name: 'redis',
    configs: {
      redis: {
        // node-redis configs options.
        // https://github.com/NodeRedis/node-redis#options-object-properties
        options: {
          host: '[HOST]', // redis host
          port: 18085, // redis port
          password: '[PASSWORD]',
        },
      },
    },
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
  '/users-with-redis',
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
  '/users-without-redis',
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

const server = app.listen(2000, () =>
  console.log('[REDIS]: Server running at http://127.0.0.1:2000')
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
