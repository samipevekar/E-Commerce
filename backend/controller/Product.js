import { Product } from "../model/Product.js";

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
  let query = Product.find({})
  let totalProductsQuery = Product.find({})
  
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