module.exports = function (app) {
    app.get('/download/ytmp4', async (req, res) => {
        try {
            const { url } = req.query;
            if (!url) {
                return res.json({ status: false, error: 'Url is required' });
            }
            const results = await global.fetchJson(`https://fastrestapis.fasturl.cloud/downup/ytmp4?url=${url}&quality=720&server=auto`);
            res.status(200).json({
                status: true,
                result: results.result
            });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });

    app.get('/download/ytmp3', async (req, res) => {
        try {
            const { url } = req.query;
            if (!url) return res.json({ status: false, error: 'Url is required' });

            const results = await global.fetchJson(`https://api.siputzx.my.id/api/dl/youtube/mp3?url=${encodeURIComponent(url)}`);
            
            res.status(200).json({
                status: true,
                result: results.data
            });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};