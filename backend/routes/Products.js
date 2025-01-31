import express from 'express'
import { createProduct, fetchAllProducts, fetchProductById, getKey, paymentVerification, processPayment, updateProduct } from '../controller/Product.js'
import { Product } from '../model/Product.js'

const router = express.Router()


router.post('/', createProduct)
router.get('/', fetchAllProducts)
router.get('/:id', fetchProductById)
router.patch('/:id',updateProduct)
router.post('/payment/process',processPayment)
router.get('/payment/getkey',getKey)
router.post('/payment/verification',paymentVerification)

router.get('/update/test',async(req,res)=>{
            // For adding discountPrice to existing data : delete this code after use
           const products = await Product.find({});
           for(let product of products){
            product.stock = 10
            await product.save()
            console.log(product.title+ ' updated')
           }
           res.send('ok')
})



export default router

