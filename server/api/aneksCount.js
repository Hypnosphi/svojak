const getPost = require('../../getPost')

module.exports = async (req, res) => {
  const {count} = await getPost(0)
  res.end(String(count))
}
