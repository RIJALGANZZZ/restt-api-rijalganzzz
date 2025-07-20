const fetch = require("node-fetch");
const https = require("https");

async function getBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const data = [];
      res.on("data", (chunk) => data.push(chunk));
      res.on("end", () => resolve(Buffer.concat(data)));
    }).on("error", reject);
  });
}

module.exports = function(app) {
  app.get('/random/emojimix', async (req, res) => {
    try {
      const { emoji1, emoji2 } = req.query;
      if (!emoji1 || !emoji2) return res.status(400).json({ error: "emoji1 and emoji2 are required" });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`, {
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) return res.status(500).json({ error: `Fetch failed with status ${response.status}` });

      const json = await response.json();
      const img = json.results?.[0]?.url;
      if (!img) return res.status(404).json({ error: "No image found for these emojis" });

      const image = await getBuffer(img);

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': image.length,
      });
      res.end(image);
    } catch (error) {
      res.status(500).json({ error: error.name === 'AbortError' ? 'Request timeout' : error.message });
    }
  });
  }
