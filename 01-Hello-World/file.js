const fs = require('fs');
const os = require('os')

console.log(os.cpus().length);

//Sync.... Blocking....
// fs.writeFileSync('./test.txt', "Hey There");


//Async.... Non Blocking ....
// fs.writeFileSync('./test.txt', "Hey There Async", (err)=>{
//     return err;
// });

// const result = fs.readFileSync('./contacts.txt',"utf-8")

// console.log(result);

// fs.readFile('./contacts.txt',"utf-8",(err,result)=>{
//     if(err){
//         console.log('Error',err);
//     }
//     else{
//         console.log(result);
//     }
// })

// fs.appendFileSync("./test.txt", `${Date.now()} Hey There\n`);

// // fs.cpSync('./test.txt','./cpy.txt')

// // fs.unlinkSync("./cpy.txt")

// console.log(fs.statSync("./test.txt"));
