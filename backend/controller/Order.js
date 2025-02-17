import { Order } from "../model/Order.js"
import { Product } from "../model/Product.js"
import { User } from "../model/User.js"
import { invoiceTemplate, sendMail } from "../services/common.js"

export const fetchOrderByUser = async(req,res)=>{
    const {id} = req.user
    try {
        const orders = await Order.find({user:id})
        res.status(200).json(orders)
    } catch (error) {
        res.status(400).json(error)
    }
}


export const createOrder = async (req, res) => {
    const order = new Order(req.body)

      for(let item of order.items){
      let product = await Product.findOne({_id:item.product.id})
      product.$inc('stock',-1*item.quantity)
      await product.save()
    }
  try {
    const doc = await order.save();
    const user = await User.findById(order.user)

    if(order.paymentMethod == 'card'){
      let newOder = await Order.findById(order.id)
      newOder.paymentStatus = 'received'
      await newOder.save()
    }

    sendMail({to:user.email,html:invoiceTemplate(order),subject:'Order Received'})

    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
    try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};


export const fetchAllOrders = async (req, res) => {
  let query = Order.find({deleted:{$ne:true}})
  let totalOrdersQuery = Order.find({deleted:{$ne:true}})
  
    
  //TODO: how to get sort on discounted price not on actual price
  if(req.query._sort && req.query._order){
    query = query.sort({[req.query._sort]:req.query._order})
  }
  
  const totalDocs = await totalOrdersQuery.countDocuments().exec()
  
  if(req.query._page && req.query._limit){
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize*(page-1)).limit(pageSize)
  }

  try {
    const docs = await query.exec();
    // let newDocs = await docs.reverse()
    res.set('X-Total-Count',totalDocs)
    res.status(200).json(docs);
  } catch (error) {
    res.status(400).json(error);
  }
};
