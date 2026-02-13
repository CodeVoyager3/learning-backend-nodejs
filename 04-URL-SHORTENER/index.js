const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const {checkForAuthentication,restrictTo} = require('./middlewares/auth')
const { connectToMongoDB } = require('./connect')

const URL = require('./models/url');

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')

const app = express();
const PORT = 8001

connectToMongoDB('mongodb://localhost:27017/urlShortener')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err)=>{
        console.log(`Mongo Error : ${err}`);  
    })

app.set("view engine", "ejs");
app.set('views',path.resolve("./views"));

app.use(express.json())
app.use(express.urlencoded({ extended : false}))
app.use(cookieParser())
app.use(checkForAuthentication);

app.use("/url",restrictTo(['NORMAL']), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute)

app.get('/:shortId', async (req, res) => {
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

        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`))