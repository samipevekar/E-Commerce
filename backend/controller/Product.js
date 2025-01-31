import { Product } from "../model/Product.js";
import { instance } from "../index.js";
import crypto from "crypto";
import { log } from "console";
import { Order } from "../model/Order.js";

export const createProduct = async (req, res) => {
  const product = new Product(req.body);
  product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
  try {
    const response = await product.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const fetchAllProducts = async (req, res) => {
  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);


  if (req.query.category) {
    query = query.find({ category: {$in:req.query.category.split(',')} });
    totalProductsQuery = totalProductsQuery.find({
      category: {$in:req.query.category.split(',')},
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: {$in:req.query.brand.split(',')} });
    totalProductsQuery = totalProductsQuery.find({ brand: {$in:req.query.brand.split(',')}});
  }

  //TODO: how to get sort on discounted price not on actual price
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.countDocuments().exec();

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const fetchProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
    const updatedProduct = await product.save()
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
};

// Razorpay
export const processPayment = async (req, res) => {
  const {amount} = req.body
  try {
    if (!amount) {
      return res.status(400).json({ message: "total amount is required" });
    }

    const options = {
      amount: Number(amount * 100),
      currency: "INR"
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
  }
};

//Get key
export const getKey = async (req, res) => {
  try {
    res.status(200).json({
      key: process.env.RAZORPAY_API_KEY,
    });
  } catch (error) {
    console.log(error);
  }
};

// payment verification
// payment verification
export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthenticate = expectedSignature === razorpay_signature;

    if (isAuthenticate) {
      // Respond with success and payment ID for frontend use
      return res.status(200).json({
        success: true,
        payment_id: razorpay_payment_id, // Payment ID to be used for order creation
      });
    }

    // If signature doesn't match, return failure
    res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  } catch (error) {
    console.log(error);
  }
};
