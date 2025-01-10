import { Brand } from "../model/Brand.js"

export const fetchAllBrands = async(req,res)=>{
    try {
        const brands = await Brand.find({})
        res.status(200).json(brands)
    } catch (error) {
        res.status(400).json(error)
    }
}

export const createBrand = async (req, res) => {
  try {
    const brand = new Brand(req.body);
    const response = await brand.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};