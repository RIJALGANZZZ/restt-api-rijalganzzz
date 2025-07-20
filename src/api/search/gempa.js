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

    async function fetchShakemap(url) {
        try {
            const imgRes = await fetch(url)
            if (!imgRes.ok) return null
            return await imgRes.buffer()
        } catch {
            return null
        }
    }

    app.get('/search/gempa', async (req, res) => {
        try {
            const data = await getGempaData()
            const shakemapPath = data?.Infogempa?.gempa?.Shakemap
            const shakemapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${shakemapPath}`
            const buffer = await fetchShakemap(shakemapUrl)

            let catboxUrl = null
            if (buffer) catboxUrl = await uploadToCatbox(buffer)

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
                    shakemap: catboxUrl || 'Shakemap tidak tersedia'
                }
            })
        } catch (err) {
            res.status(500).json({ status: false, message: err.message })
        }
    })
}
