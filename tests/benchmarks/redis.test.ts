import axios from 'axios'

describe('The performance of suya with redis', () => {
  test('if there is any performance increase when using redis', async (done) => {
    let url = 'http://127.0.0.1:2000'
    let totalRequest: number = 20
    let totalResponseTime: number = 0
    let responseTimeInArray: string[] = []

    /**
     *  with redis
     */
    for (let i = 1; i <= totalRequest; i++) {
      let { headers } = await axios.get(`${url}/users-with-redis`)

      responseTimeInArray.push(headers['x-response-time'])
      totalResponseTime += parseFloat(headers['x-response-time'].split('ms')[0])
    }

    // average response time with redis
    let averageResponseTimeWithRedis = totalResponseTime / totalRequest
    // // response time of all request with redis
    // console.log('[REDIS]: Response Time With Redis - ', responseTimeInArray)

    totalResponseTime = 0
    responseTimeInArray = []

    /**
     *  without redis
     */
    for (let i = 1; i <= totalRequest; i++) {
      let { headers } = await axios.get(`${url}/users-without-redis`)

      responseTimeInArray.push(headers['x-response-time'])
      totalResponseTime += parseFloat(headers['x-response-time'].split('ms')[0])
    }

    // average response time without redis
    let averageResponseTimeWithoutRedis = totalResponseTime / totalRequest
    // // response time of all request without redis
    // console.log('[REDIS]: Response Time Without Redis - ', responseTimeInArray)

    totalResponseTime = 0
    responseTimeInArray = []

    expect(averageResponseTimeWithRedis).toBeLessThan(
      averageResponseTimeWithoutRedis
    )

    done()
  })
})
