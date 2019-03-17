const fs = require('fs')
const url = require('url')
const querystring = require('querystring')

const axios = require('axios')

const yandexAuth = require('../yandexAuth')
const folderId = process.env.FOLDER_ID

module.exports = async (req, res, getText) => {
  const {search} = url.parse(req.url)
  const text = getText
    ? await getText()
    : querystring.parse(search.slice(1)).text
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

    res.setHeader('Content-Type', 'audio/ogg')
    if (process.env.NODE_ENV === 'production') {
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=31536000, max-age=31536000',
      )
    }
    data.pipe(res)
  } catch (e) {
    if (e.response) {
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
    }
    console.error(e)
    res.statusCode = 500
    res.end()
  }
}
