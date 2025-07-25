const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

module.exports = function (app) {
  app.get('/imagecreator/bratvideo', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, message: 'text parameter is required' });

    try {
      const words = text.split(' ');
      const tempDir = path.join(process.cwd(), 'tmp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
      const framePaths = [];

      for (let i = 0; i < words.length; i++) {
        const currentText = words.slice(0, i + 1).join(' ');
        const url = `https://aqul-brat.hf.space/?text=${encodeURIComponent(currentText)}`;
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        const framePath = path.join(tempDir, `frame${i}.png`);
        fs.writeFileSync(framePath, response.data);
        framePaths.push(framePath);
      }

      const imageListFile = path.join(tempDir, 'images.txt');
      const content = framePaths.map(f => `file '${f}'\nduration 0.5`).join('\n') + `\nfile '${framePaths.at(-1)}'\nduration 3`;
      fs.writeFileSync(imageListFile, content);

      const outputPath = path.join(tempDir, 'output.mp4');
      execSync(`ffmpeg -y -f concat -safe 0 -i ${imageListFile} -vf "fps=30,format=yuv420p" ${outputPath}`);

      const buffer = fs.readFileSync(outputPath);
      res.setHeader('Content-Type', 'video/mp4');
      res.send(buffer);

      framePaths.forEach(f => fs.unlinkSync(f));
      fs.unlinkSync(imageListFile);
      fs.unlinkSync(outputPath);
    } catch (e) {
      console.error('❌ ERROR:', e);
      res.status(500).json({ status: false, message: 'Failed to generate brat video', error: e.toString() });
    }
  });
};
