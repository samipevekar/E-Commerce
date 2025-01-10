import { Category } from "../model/Category.js"

export const fetchAllCategory = async(req,res)=>{
    try {
        const categories = await Category.find({})
        res.status(200).json(categories)
    } catch (error) {
        res.status(400).json(error)
    }
}


export const createCategory = async (req, res) => {
    try {
      const category = new Category(req.body);
      const response = await category.save();
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json(error);
    }
};