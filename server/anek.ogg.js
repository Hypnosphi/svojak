const url = require('url')
const querystring = require('querystring')

const getPost = require('../getPost')

const tts = require('./tts.ogg')

module.exports = (req, res) => {
  const {search} = url.parse(req.url)
  const {index} = querystring.parse(search.slice(1))
  return tts(req, res, async () => {
    const {text} = await getPost(index)
    return text
  })
}
