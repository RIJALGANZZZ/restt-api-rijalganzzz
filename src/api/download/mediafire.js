module.exports = function (app) {
app.get('/download/mediafire', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ status: false, error: 'Url is required' });

        const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
        const response = await fetch(`https://zenz.biz.id/downloader/mediafire?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        res.status(200).json({
            status: true,
            creator: 'RijalGanzz',
            result: data.result
        });
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});
}
