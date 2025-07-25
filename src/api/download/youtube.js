const { getInfo } = require('cnvmp3');

module.exports = function (app) {
    async function fetchYtMedia(url) {
        const data = await getInfo(url);
        return data;
    }

    app.get('/download/ytmp3', async (req, res) => {
        try {
            const { url } = req.query;
            if (!url) return res.status(400).json({ status: false, error: 'Parameter "url" is required' });

            const result = await fetchYtMedia(url);
            const audio = result?.mp3?.[0];
            if (!audio) return res.status(404).json({ status: false, error: 'MP3 not found' });

            res.status(200).json({
                status: true,
                type: 'mp3',
                title: result.title,
                thumbnail: result.thumbnail,
                quality: audio.quality,
                size: audio.size,
                url: audio.url
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });

    app.get('/download/ytmp4', async (req, res) => {
        try {
            const { url } = req.query;
            if (!url) return res.status(400).json({ status: false, error: 'Parameter "url" is required' });

            const result = await fetchYtMedia(url);
            const video = result?.mp4?.[0];
            if (!video) return res.status(404).json({ status: false, error: 'MP4 not found' });

            res.status(200).json({
                status: true,
                type: 'mp4',
                title: result.title,
                thumbnail: result.thumbnail,
                quality: video.quality,
                size: video.size,
                url: video.url
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
              }
