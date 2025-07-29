const axios = require('axios');

module.exports = function (app) {
  app.get('/download/ttmusic', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: 'url parameter is required' });

    try {
      const response = await axios.get('https://www.tikwm.com/api/', {
        params: { url },
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json'
        }
      });

      const musicId = response.data?.data?.music_info?.id;
      if (!musicId) return res.status(500).json({ status: false, message: 'music ID not found' });

      const musicUrl = `https://www.tikwm.com/video/music/${musicId}.mp3`;
      const audio = await axios.get(musicUrl, { responseType: 'arraybuffer' });

      res.setHeader('Content-Type', 'audio/mpeg');
      res.send(audio.data);
    } catch {
      res.status(500).json({ status: false, message: 'Failed to fetch music from tikwm' });
    }
  });
};
