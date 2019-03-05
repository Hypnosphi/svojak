const fs = require('fs')
const url = require('url')
const querystring = require('querystring')

const axios = require('axios')

const yandexAuth = require('../yandexAuth')
const folderId = process.env.FOLDER_ID

module.exports = async (req, res) => {
  const {search} = url.parse(req.url)
  const {text} = querystring.parse(search.slice(1))
  try {
    const {data, headers} = await axios(
      `https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize`,
      {
        method: 'post',
        data: querystring.stringify({text, voice: 'alyss', folderId}),
        headers: {
          Authorization: `Bearer ${await yandexAuth()}`,
        },
        responseType: 'stream',
      },
    )

    res.setHeader('Content-Type', headers['content-type'])

    data.pipe(res)
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.end()
  }
}
