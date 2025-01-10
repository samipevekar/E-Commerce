import { User } from "../model/User.js";

export const createUser = async (req, res) => {
    const user = new User(req.body)
    try {
      const doc = await user.save();
      res.status(201).json(doc);
    } catch (error) {
      res.status(400).json(error);
      console.log(error)
    }
};

export const loginUser = async (req, res) => {
    try {
        const user =await User.findOne({email:req.body.email});
        if(!user){
            res.status(401).json({message:'no such user email'})
        }
        else if(user.password === req.body.password){
            res.status(200).json({id:user.id, email:user.email, name:user.name})
        }else{
            res.status(401).json({message:"invalid credentials"})
        }
      } catch (error) {
        res.status(400).json(error);
        console.log(error)
      }
};
