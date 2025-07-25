const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

module.exports = function (app) {
  app.get('/imagecreator/bratvideo', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, message: 'text parameter is required' });

    try {
      const words = text.split(" ");
      const tempDir = path.join(process.cwd(), "tmp");
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
      const framePaths = [];

      for (let i = 0; i < words.length; i++) {
        const currentText = words.slice(0, i + 1).join(" ");
        const response = await axios.get(`https://rest-api.nazirganz.space/maker/brat?text=${encodeURIComponent(currentText)}`, {
          responseType: 'arraybuffer'
        });
        const framePath = path.join(tempDir, `frame${i}.mp4`);
        fs.writeFileSync(framePath, response.data);
        framePaths.push(framePath);
      }

      const fileListPath = path.join(tempDir, 'filelist.txt');
      let fileListContent = framePaths.map(p => `file '${p}'\nduration 0.5`).join('\n') + `\nfile '${framePaths[framePaths.length - 1]}'\nduration 3`;
      fs.writeFileSync(fileListPath, fileListContent);

      const outputVideoPath = path.join(tempDir, 'output.mp4');
      execSync(`ffmpeg -y -f concat -safe 0 -i ${fileListPath} -vf "fps=30" -c:v libx264 -preset veryfast -pix_fmt yuv420p ${outputVideoPath}`);

      const videoBuffer = fs.readFileSync(outputVideoPath);
      res.setHeader('Content-Type', 'video/mp4');
      res.send(videoBuffer);

      framePaths.forEach(p => fs.unlinkSync(p));
      fs.unlinkSync(fileListPath);
      fs.unlinkSync(outputVideoPath);
    } catch (e) {
      console.error(e);
      res.status(500).json({ status: false, message: 'Failed to generate brat video' });
    }
  });
};
