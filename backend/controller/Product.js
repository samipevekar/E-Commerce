import { Product } from "../model/Product.js";
import { instance } from "../index.js";
import crypto from 'crypto'
import { log } from "console";

export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const response = await product.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const fetchAllProducts = async (req, res) => {
  let condition = {}
  if(!req.query.admin){
    condition.deleted = {$ne:true}
  }

  let query = Product.find(condition)
  let totalProductsQuery = Product.find(condition)
  
  if(req.query.category){
    query = query.find({category: req.query.category})
    totalProductsQuery = totalProductsQuery.find({category: req.query.category})
  }
  if(req.query.brand){
    query = query.find({brand:req.query.brand})
    totalProductsQuery = totalProductsQuery.find({brand: req.query.brand})

  }
  
  //TODO: how to get sort on discounted price not on actual price
  if(req.query._sort && req.query._order){
    query = query.sort({[req.query._sort]:req.query._order})
  }
  
  const totalDocs = await totalProductsQuery.countDocuments().exec()
  
  if(req.query._page && req.query._limit){
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize*(page-1)).limit(pageSize)
  }

  try {
    const docs = await query.exec();
    res.set('X-Total-Count',totalDocs)
    res.status(200).json(docs);
  } catch (error) {
    res.status(400).json(error);
  }
};


export const fetchProductById = async(req,res) => {
  const {id} = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error);
    console.log(error)
  }
}

export const updateProduct = async(req,res) => {
  const {id} = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id,req.body,{new:true});
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error);
    console.log(error)
  }
}


// Razorpay 
export const processPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid or missing amount" });
    }

    const options = {
      amount: amount * 100, // Razorpay expects the amount in paise (integer value)
      currency: "INR",
    };

    // Create order using Razorpay instance
    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error in processPayment:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Could not process payment.",
    });
  }
};


//Get key
export const getKey = async(req,res)=>{
  try {
    res.status(200).json({
      key:process.env.RAZORPAY_API_KEY
    })
  } catch (error) {
    console.log(error)
  }
}

// payment verification
export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment details",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body)
      .digest("hex");

    // Validate signature
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        payment_id: razorpay_payment_id, // Include payment ID for further processing
      });
    }

    res.status(400).json({
      success: false,
      message: "Payment verification failed. Invalid signature.",
    });
  } catch (error) {
    console.error("Error in paymentVerification:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Could not verify payment.",
    });
  }
};
