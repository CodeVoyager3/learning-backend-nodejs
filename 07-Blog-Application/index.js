const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const {checkForAuthentication } = require('./middlewares/auth')
const Blog = require('./models/blog')

const app = express()
const PORT = 8000;

mongoose.connect('mongodb://localhost:27017/blogify').then( e => {
    console.log('MongoDb connected');
} )
app.set("view engine", "ejs")
app.set('views', path.resolve("./views"))

app.get('/', async (req,res)=>{
    const allBlogs = await Blog.find({})
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    })
})


// Body parsing middleware (for form submissions and JSON)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(checkForAuthentication("token"))


// Serve static files from /public (uploads, images, css, etc.)
app.use(express.static(path.resolve('./public')))

app.get('/', async (req,res)=>{
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }).lean()
        res.render("home", {
            user: req.user,
            blogs,
        })
    } catch (err) {
        console.error('Error fetching blogs:', err)
        res.status(500).send('Internal Server Error')
    }
})

app.use("/user",userRoute)
app.use("/blog", blogRoute)

app.listen(PORT, ()=>{
    console.log(`Server Started at PORT:${PORT}`);
})

