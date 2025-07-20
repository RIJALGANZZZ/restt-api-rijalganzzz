const cheerio = require("cheerio")
const axios = require("axios")

const headers = {
  authority: "p16-sign-va.tiktokcdn.com",
  accept: "application/json, text/plain, */*",
  origin: "https://p16-sign-va.tiktokcdn.com",
  referer: "https://p16-sign-va.tiktokcdn.com",
  "user-agent": "Postify/1.0.0",
}

const tiktokdl = {
  submit: async function (url, referer) {
    const headerx = { ...headers, referer }
    const data = { query: url, language_id: "1" }
    return axios.post("https://p16-sign-va.tiktokcdn.com", data, { headers: headerx })
  },

  parse: function ($) {
    const title = $("p.text-gray-600").text().trim()
    const nowm = $("a.w-full.text-white.font-bold").first().attr("href")
    const audio = $('a[type="audio"]').attr("href")
    const slides = $('a[type="slide"]').map((i, el) => ({
      number: i + 1,
      url: $(el).attr("href"),
    })).get()

    return { title, nowm, audio, slides }
  },

  fetchData: async function (link) {
    try {
      const response = await this.submit(link, "https://p16-sign-va.tiktokcdn.com")
      const $ = cheerio.load(response.data)
      const result = this.parse($)
      return {
        status: true,
        creator: "RijalGanzz",
        result: {
          code: 0,
          msg: "success",
          processed_time: Math.random().toFixed(4),
          data: {
            id: Date.now().toString(),
            region: "ID",
            title: result.title,
            cover: null,
            ai_dynamic_cover: null,
            origin_cover: null,
            duration: null,
            play: result.nowm,
            wmplay: null,
            hdplay: null,
            size: null,
            wm_size: null,
            hd_size: null,
            music: result.audio,
            music_info: {
              id: null,
              title: null,
              play: result.audio,
              cover: null,
              author: null,
              original: true,
              duration: null,
              album: ""
            },
            play_count: null,
            digg_count: null,
            comment_count: null,
            share_count: null,
            download_count: null,
            collect_count: null,
            create_time: null,
            anchors: null,
            anchors_extras: "",
            is_ad: false,
            commerce_info: {},
            commercial_video_info: "",
            item_comment_settings: 0,
            mentioned_users: "",
            author: {
              id: null,
              unique_id: null,
              nickname: null,
              avatar: null
            },
            slides: result.slides
          }
        }
      }
    } catch (error) {
      throw new Error("Gagal memproses link TikTok")
    }
  },
}

module.exports = function (app) {
  app.get("/download/tiktok", async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, error: "Url is required" })
      const results = await tiktokdl.fetchData(url)
      res.status(200).json(results)
    } catch (error) {
      res.status(500).json({
        status: false,
        creator: "RijalGanzz",
        error: error.message
      })
    }
  })
      }
