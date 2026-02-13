const {getUser} = require('../services/auth')

function checkForAuthentication(req,res,next){
    const authorizationHeaderValue = req.cookies?.token;
    if(!authorizationHeaderValue || !authorizationHeaderValue.startsWith('Bearer')) 
    return next()

    const token = tokenCookie;
    const user = getUser(token)

    req.user = user ;
    return next()
}


function restrictTo(roles){
    return function(req,res,next){
        if(!req.user) return res.redirect("/login")

        if(!roles.includes(req.user.role)) return res.end("Unauthorized")

        return next()
    }
}

function restrictToLoggedInUserOnly(req, res, next){
    if(!req.user) return res.redirect("/login")
    return next()
}

module.exports = {
    restrictTo,
    checkForAuthentication,
    restrictToLoggedInUserOnly,
}