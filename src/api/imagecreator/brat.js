const axios = require('axios');

module.exports = function (app) {
  app.get('/imagecreator/brat', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, message: 'text parameter is required' });

    try {
      const image = await axios.get(`https://aqul-brat.hf.space/?text=${encodeURIComponent(text)}`, {
        responseType: 'arraybuffer'
      });
      res.setHeader('Content-Type', 'image/png');
      res.send(image.data);
    } catch {
      res.status(500).json({ status: false, message: 'Failed to fetch brat image' });
    }
  });
};
