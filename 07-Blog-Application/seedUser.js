const mongoose = require('mongoose')
const User = require('./models/user')

const [,, email, password, fullNameArg] = process.argv

if (!email || !password) {
  console.error('Usage: node seedUser.js <email> <password> [fullName]')
  process.exit(1)
}

const run = async () => {
  await mongoose.connect('mongodb://localhost:27017/blogify')

  // try to find existing by email
  let user = await User.findOne({ email })

  // if not found by email, try matching by provided fullNameArg or local part
  if (!user) {
    const localPart = email.split('@')[0]
    const fullName = fullNameArg || localPart
    user = await User.findOne({ fullName })
    if (user) {
      user.email = email
      user.password = password
      await user.save()
      console.log('Updated existing user with email and password', user._id.toString())
    } else {
      user = new User({ fullName, email, password })
      await user.save()
      console.log('Created user', user._id.toString())
    }
  } else {
    // update password (will trigger pre save)
    user.password = password
    await user.save()
    console.log('Updated user password for', user._id.toString())
  }

  await mongoose.disconnect()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
