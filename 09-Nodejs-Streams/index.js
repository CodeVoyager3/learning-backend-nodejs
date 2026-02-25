const fs = require('fs')
const express = require('express')
const status = require('express-status-monitor')
const zlib = require('zlib')

const app = express()
const PORT =8000

app.use(status());

// Sample Read (Sample.txt) --> Zipper --> fs Write File 

fs.createReadStream('./sample.txt').pipe(zlib.createGzip().pipe(fs.createWriteStream("./sample.zip")))

app.get('/',(req,res)=>{
    const stream = fs.createReadStream('./sample.txt', "utf-8");
    stream.on('data', (chunk)=> res.write(chunk));
    stream.on("end", ()=> res.end());
})

app.listen(PORT, ()=>{
    console.log(`Server started at http://www.localhost:${PORT}`)
})