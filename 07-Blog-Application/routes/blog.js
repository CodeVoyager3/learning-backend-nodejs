const {Router} = require ('express')
const Blog = require('../models/blog')
const multer = require('multer')
const router = Router()
const path = require('path')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`))
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`
    cb(null, filename)
  }
})

const upload = multer({ storage: storage })

router.get('/add-new',(req,res)=>{
    return res.render('addBlog', {
        user : req.user,
    })
})

router.get('/:id', async(req,res)=>{
  try {
    const blog = await Blog.findById(req.params.id).lean()
    if (!blog) return res.status(404).send('Blog not found')
    return res.render('blog', { user: req.user, blog })
  } catch (err) {
    console.error('Error fetching blog by id:', err)
    return res.status(500).send('Internal Server Error')
  }
})

router.post('/', upload.single('coverImage'), async (req, res) => {
  try {
    console.log('POST /blog payload:', { body: req.body, file: req.file, user: req.user })
    const { title, body } = req.body
    const coverImageURL = req.file ? `/uploads/${req.file.filename}` : ''
    const blog = await Blog.create({
      body,
      title,
      createdBy: req.user._id,
      coverImageURL,
    })
    return res.redirect(`/blog/${blog._id}`)
  } catch (err) {
    console.error(err)
    return res.status(500).send('Internal Server Error')
  }
})


module.exports = router;