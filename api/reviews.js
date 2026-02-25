const gplay = require('google-play-scraper');

module.exports = async (req, res) => {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { appId, num = 500, sort = 'NEWEST', lang = 'en', country = 'us' } = req.query;

  if (!appId) {
    return res.status(400).json({ error: 'appId query parameter is required' });
  }

  try {
    const reviews = await gplay.reviews({
      appId: appId,
      num: parseInt(num),
      sort: gplay.sort[sort] || gplay.sort.NEWEST,
      lang: lang,
      country: country,
    });

    return res.status(200).json({
      appId,
      total: reviews.data.length,
      reviews: reviews.data.map(r => ({
        reviewId: r.id,
        appId: appId,
        rating: r.score,
        text: r.text,
        userName: r.userName,
        reviewDate: r.date,
        thumbsUp: r.thumbsUp,
      }))
    });

  } catch (error) {
    return res.status(500).json({ 
      error: error.message,
      appId: appId 
    });
  }
};