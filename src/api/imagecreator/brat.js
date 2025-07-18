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
    } catch (err) {
      res.status(500).json({ status: false, message: 'Failed to fetch brat image', error: err.message });
    }
  });

  app.get('/imagecreator/bratvideo', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, message: 'text parameter is required' });

    try {
      const response = await axios.get(`https://zenz.biz.id/maker/bratvid?text=${encodeURIComponent(text)}`);
      const data = response?.data;

      const videoUrl = data?.result?.video_url || data?.video_url;
      if (!videoUrl) {
        return res.status(500).json({
          status: false,
          message: 'No video_url found from provider',
          responseData: data
        });
      }

      const video = await axios.get(videoUrl, { responseType: 'arraybuffer' });
      res.setHeader('Content-Type', 'video/mp4');
      res.send(video.data);
    } catch (e) {
      res.status(500).json({
        status: false,
        message: 'Failed to fetch brat video',
        error: e.message
      });
    }
  });
};