import express from 'express'
import mongoose from 'mongoose'
import productsRouters from './routes/Products.js'
import categoriesRouters from './routes/Category.js'
import brandsRouters from './routes/Brands.js'
import cors from "cors"
const server = express()

// middlewares

server.use(express.json())
server.use(express.urlencoded())
server.use(cors({
    exposedHeaders:['X-Total-Count']
}))


server.use('/products',productsRouters)
server.use('/categories', categoriesRouters)
server.use('/brands', brandsRouters)

main().catch(err=> console.log(err))

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Ecommerce')
    console.log('Connected to MongoDB')    
}


server.get('/',(req,res)=>{
    res.json({status:'success'})
})




server.listen(8080, ()=>{
    console.log("Server started")
})