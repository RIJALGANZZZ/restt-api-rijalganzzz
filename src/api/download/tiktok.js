const axios = require("axios")

module.exports = function (app) {
  app.get("/download/tiktok", async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, error: "Url is required" })

      const apiUrl = `https://api.vreden.my.id/api/tiktok?url=${encodeURIComponent(url)}`
      const response = await axios.get(apiUrl)

      res.status(200).json({
        status: 200,
        creator: "RijalGanzz",
        result: response.data.result
      })
    } catch (error) {
      res.status(500).json({
        status: 500,
        creator: "RijalGanzz",
        message: error.message
      })
    }
  })
}
