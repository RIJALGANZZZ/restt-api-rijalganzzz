const axios = require('axios');
const FormData = require('form-data');

async function Upscale(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = response.data;

    const form = new FormData();
    form.append('image', buffer, {
      filename: 'upload.jpg',
      contentType: 'image/jpeg'
    });
    form.append('user_id', 'undefined');
    form.append('is_public', 'true');

    const headers = {
      ...form.getHeaders(),
      'Accept': '*/*',
      'Origin': 'https://picupscaler.com',
      'Referer': 'https://picupscaler.com/',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
    };

    const { data } = await axios.post('https://picupscaler.com/api/generate/handle', form, { headers });
    return data;
  } catch (err) {
    return { error: true, message: err.message };
  }
}

module.exports = function(app) {
  app.get('/imagecreator/hd', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: 'Masukkan parameter ?url=' });

    try {
      const result = await Upscale(url);
      if (result.error) throw new Error(result.message);

      res.status(200).json({
        status: true,
        result
      });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  });
};
