const axios = require("axios")

module.exports = function(app) {
  app.get("/download/tiktok", async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, error: "Url is required" })

      const response = await axios.get(`https://izumi-apis.zone.id/downloader/tiktokdl?url=${encodeURIComponent(url)}`)
      res.status(200).json({
        status: true,
        creator: "RijalGanzz",
        result: response.data.result
      })
    } catch (error) {
      res.status(500).send(`Error: ${error.message}`)
    }
  })
}
