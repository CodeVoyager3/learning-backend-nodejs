const {Router} = require ('express')
const User = require('../models/user')

const router = Router()

router.get('/signup',(req,res)=>{
    return res.render('signup')
})

router.get('/signin',(req,res)=>{
    return res.render('signin')
})

router.post('/signin', async (req,res)=>{
    const { email, password} = req.body;
    try{
        const result = await User.matchPasswordAndGenerateToken(email,password);
        const { token, user } = result;
        console.log('User', user);
        // set httpOnly cookie with token
        res.cookie && res.cookie('token', token, { httpOnly: true });
        return res.redirect('/');
    }catch(err){
        console.error(err);
        return res.render('signin', {
            error: "Incorrect Email Or Password"
        });
    }
})

router.post('/signup',async (req,res)=>{
    const { fullName, email, password} = req.body;
    await User.create({
        fullName,
        email,
        password,
    });  
    return res.redirect("/");
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.redirect('/signin');
})

module.exports = router;