const express = require('express');
const { handleGenerateNewShortURL, handleGetAnalytics, handleRedirectShortURL } = require('../controllers/url')
const { restrictToLoggedInUserOnly } = require('../middlewares/auth')
const router = express.Router();

router.post('/', restrictToLoggedInUserOnly, handleGenerateNewShortURL);

router.get('/analytics/:shortId', restrictToLoggedInUserOnly, handleGetAnalytics);

router.get('/:shortId', handleRedirectShortURL);

module.exports = router
