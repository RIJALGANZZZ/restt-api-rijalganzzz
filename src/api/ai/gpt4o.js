const fetch = require("node-fetch");

module.exports = function(app) {
  app.get('/ai/gpt4o', async (req, res) => {
    try {
      const { prompt } = req.query;
      if (!prompt) return res.status(400).json({ error: "Prompt is required" });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`https://zenz.biz.id/ai/gpt4o?prompt=${encodeURIComponent(prompt)}`, {
        signal: controller.signal
      });
      clearTimeout(timeout);

      const json = await response.json();

      const pertanyaan = prompt.toLowerCase();
      const trigger = ["siapa pembuatmu", "siapa penciptamu", "siapa yang membuatmu", "kamu dibuat oleh siapa"];

      const isCreatorQuestion = trigger.some(p => pertanyaan.includes(p));

      if (isCreatorQuestion) {
        return res.json({
          status: true,
          creator: "RijalGanzz",
          result: {
            status: "success",
            msg: "Manual override",
            greeting_message: "Saya dibuat oleh RijalGanzz dan saya adalah Elaina.",
            data: "Saya dibuat oleh RijalGanzz dan saya adalah Elaina.",
            log: false
          }
        });
      } else {
        return res.json({
          status: true,
          creator: "RijalGanzz",
          result: json.result
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.name === 'AbortError' ? 'Request timeout' : error.message });
    }
  });
};
