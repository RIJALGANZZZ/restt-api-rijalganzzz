const axios = require("axios")

module.exports = function(app) {
  app.get("/download/tiktok", async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, error: "Url is required" })

      const { data } = await axios.get(`https://zenz.biz.id/downloader/tiktok?url=${encodeURIComponent(url)}`)
      if (!data || !data.status) return res.json({ status: false, error: "Failed to fetch result" })

      res.status(200).json({
        status: true,
        creator: "RijalGanzz",
        result: data.result
      })
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      })
    }
  })
}
