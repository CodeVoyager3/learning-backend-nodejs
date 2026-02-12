const { nanoid } = require('nanoid')
const URL = require('../models/url')

async function handleGenerateNewShortURL(req, res) {
    const body = req.body
    if (!body.url) return res.status(400).json({ error: "url is required" })
    const shortID = nanoid(8);

    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
    });

    return res.render("home",{ id: shortID })
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    if (!result) return res.status(404).json({ error: "Short URL not found" });
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

async function handleRedirectShortURL(req, res) {
    try {
        const shortId = req.params.shortId;
        console.log(`Redirecting for shortId: ${shortId}`);

        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            },
            { new: true }
        );

        if (!entry) {
            return res.status(404).send("Short URL not found");
        }

        let redirectURL = entry.redirectURL;
        // Add protocol if missing
        if (!redirectURL.startsWith('http://') && !redirectURL.startsWith('https://')) {
            redirectURL = 'http://' + redirectURL;
        }

        res.redirect(redirectURL);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleRedirectShortURL,
}