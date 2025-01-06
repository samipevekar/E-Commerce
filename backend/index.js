import express from 'express'
import mongoose from 'mongoose'
import { createProduct } from './controller/Product.js'
const server = express()

// middlewares

server.use(express.json())
server.use(express.urlencoded())

main().catch(err=> console.log(err))

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Ecommerce')
    console.log('Connected to MongoDB')    
}


server.get('/',(req,res)=>{
    res.json({status:'success'})
})

server.post('/products', createProduct)

server.listen(8080, ()=>{
    console.log("Server started")
})