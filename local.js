const path = require('path')

const micro = require('micro')
const fsRouter = require('fs-router')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

const match = fsRouter(path.resolve('./server'))

const start = async () => {
  await app.prepare()
  micro(async (req, res) => {
    const matched = match(req)
    if (matched) {
      return await matched(req, res)
    }
    return handle(req, res)
  }).listen(3000)
}

start()
