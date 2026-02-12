const express = require("express");

const { logReqRes } = require("./middlewares")
const { connectMongoDb } = require('./connection')

const userRouter = require('./routes/user')

const app = express()
const PORT = 8000


//Connection
connectMongoDb('mongodb://localhost:27017/firstDB')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.log({ 'Mongo Error': err });
    })

// Middleware - Plugin
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"))

// Routes
app.use("/api/users", userRouter)

app.listen(PORT, () => {
    console.log(`Server Running at PORT: ${PORT} !!`);
})