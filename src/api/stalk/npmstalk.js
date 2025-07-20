const axios = require("axios")

async function npmstalk(packageName) {
  try {
    const res = await axios.get(`https://registry.npmjs.org/${packageName}`)
    const versions = res.data.versions
    const allver = Object.keys(versions)
    const verLatest = allver[allver.length - 1]
    const verPublish = allver[0]
    const packageLatest = versions[verLatest] || {}
    const publishVersion = versions[verPublish] || {}

    return {
      name: packageName,
      versionLatest: verLatest,
      versionPublish: verPublish,
      versionUpdate: allver.length,
      latestDependencies: Object.keys(packageLatest.dependencies || {}).length,
      publishDependencies: Object.keys(publishVersion.dependencies || {}).length,
      publishTime: res.data.time?.created || null,
      latestPublishTime: res.data.time?.[verLatest] || null
    }
  } catch (err) {
    if (err.response && err.response.status === 404) {
      throw new Error('Package not found')
    }
    throw err
  }
}

module.exports = function (app) {
  app.get('/stalk/npmstalk', async (req, res) => {
    const { name } = req.query
    if (!name) return res.json({ status: false, error: 'Name is required' })

    try {
      const result = await npmstalk(name)
      res.status(200).json({
        status: true,
        result
      })
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      })
    }
  })
}
