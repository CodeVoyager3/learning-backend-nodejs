const { createHmac, randomBytes } = require('crypto')
const { Schema, model } = require('mongoose')
const { createTokenForUser } = require('../services/auth')

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: '/images/default.png',
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },
}, { timestamps: true })

userSchema.pre('save', async function () {
    const user = this

    if (!user.isModified('password')) return

    const salt = randomBytes(16).toString('hex')

    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex')

    user.salt = salt
    user.password = hashedPassword
})

userSchema.static('matchPasswordAndGenerateToken', async function(email,password){
    const user = await this.findOne({ $or: [{ email }, { fullName: email }] });
    if (!user) throw new Error('User not found!');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

    if(hashedPassword!== userProvidedHash){
        throw new Error('incorrect password')
    }
    const safe = user.toObject ? user.toObject() : Object.assign({}, user);
    delete safe.password;
    delete safe.salt;

    const token = createTokenForUser(safe)
    return { token, user: safe };
})

const User = model('User', userSchema)

module.exports = User