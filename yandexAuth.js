const path = require('path')
const fs = require('fs')

const axios = require('axios')

const yandexPassportOauthToken = process.env.YANDEX_TOKEN

let iamToken, expiresAt

module.exports = async () => {
  const now = new Date().getTime()
  if (iamToken && expiresAt - now > 60000) {
    return iamToken
  }

  const {data} = await axios.post(
    'https://iam.api.cloud.yandex.net/iam/v1/tokens',
    {yandexPassportOauthToken},
  )
  iamToken = data.iamToken
  expiresAt = new Date(data.expiresAt).getTime()
  return iamToken
}
