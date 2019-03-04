require('dotenv').config()
const fs = require('fs')
const querystring = require('querystring')

const axios = require('axios')

const yandexAuth = require('../yandexAuth')
const token =
  '***REMOVED***'
const folderId = process.env.FOLDER_ID

module.exports = async (req, res) => {
  const {text} = req.query
  const {data} = await axios(
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

  data.pipe(res)
}
