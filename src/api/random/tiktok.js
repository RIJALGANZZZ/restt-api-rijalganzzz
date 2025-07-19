const axios = require("axios");

module.exports = function(app) {
  app.get("/download/tiktok", async (req, res) => {
    try {
      const { url } = req.query;
      if (!url) return res.json({ status: false, error: "Url is required" });

      const response = await axios.get(`https://izumi-apis.zone.id/downloader/tiktokdl?url=${encodeURIComponent(url)}`);
      const data = response.data;

      // Paksa ganti creator dan pastikan struktur sesuai
      const result = typeof data.result === "object" ? data.result : data;

      res.status(200).json({
        status: data.status === false ? false : true,
        creator: "RijalGanzz",
        result: result
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
