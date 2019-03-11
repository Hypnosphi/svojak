const VK = require('vk-io').default

const MAX_LENGTH = 5000

const vk = new VK()
vk.token = process.env.VK_TOKEN
let count = 19891

module.exports = async index => {
  const response = await vk.api.wall.get({
    owner_id: process.env.GROUP_ID,
    offset: index === -1 ? 0 : count - index - 1,
    count: 1,
  })
  count = response.count

  const {text} = response.items[0]
  if (text.length > 0 && text.length <= MAX_LENGTH) {
    return {text, count}
  }
  return getPost(index + 1)
}
