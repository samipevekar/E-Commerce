import { Category } from "../model/Category.js"
import { User } from "../model/User.js"

export const fetchUserById = async(req,res)=>{
    const {id} = req.params
    try {
        const user = await User.findById(id, 'name email id')
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json(error)
        console.log(error)
    }
}



export const updateUser = async(req,res) => {
  const {id} = req.params;
  try {
    const user = await User.findByIdAndUpdate(id,req.body,{new:true});
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
    console.log(error)
  }
}