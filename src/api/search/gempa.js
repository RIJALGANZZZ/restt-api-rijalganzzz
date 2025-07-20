const fetch = require('node-fetch')
const FormData = require('form-data')

module.exports = function(app) {
    async function getGempaData() {
        const res = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json')
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
        return await res.json()
    }

    async function uploadToCatbox(buffer, filename = 'shakemap.jpg') {
        const form = new FormData()
        form.append('reqtype', 'fileupload')
        form.append('fileToUpload', buffer, { filename })

        const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form })
        if (!res.ok) throw new Error('Catbox upload failed')
        return await res.text()
    }

    app.get('/search/gempa', async (req, res) => {
        try {
            const data = await getGempaData()
            const imgUrl = 'https://data.bmkg.go.id/DataMKG/TEWS/' + data.Infogempa.gempa.Shakemap

            const imgRes = await fetch(imgUrl)
            if (!imgRes.ok) throw new Error('Image fetch error!')
            const buffer = await imgRes.buffer()

            const catboxUrl = await uploadToCatbox(buffer)

            res.json({
                status: true,
                message: 'Berhasil mendapatkan info gempa',
                data: {
                    lokasi: data.Infogempa.gempa.Wilayah,
                    waktu: data.Infogempa.gempa.Jam,
                    tanggal: data.Infogempa.gempa.Tanggal,
                    magnitudo: data.Infogempa.gempa.Magnitude,
                    kedalaman: data.Infogempa.gempa.Kedalaman,
                    koordinat: data.Infogempa.gempa.Coordinates,
                    potensi: data.Infogempa.gempa.Potensi,
                    shakemap: catboxUrl
                }
            })
        } catch (err) {
            res.status(500).json({ status: false, message: err.message })
        }
    })
                }
