import { User } from "../model/User.js";
import crypto from "crypto";
import { sanitizeUser } from "../services/common.js";
import jwt from 'jsonwebtoken'

const SECRET_KEY = 'SECRET_KEY'


export const createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      'sha256',
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();

        req.login(sanitizeUser(doc), (err) => {
          // this also calls serializer and adds to session
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
            res
              .cookie('jwt', token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({id:doc.id,name:doc.name, role:doc.role,token:token});
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

export const loginUser = async (req, res) => {
  const user = req.user
    res
    .cookie('jwt', user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({id:user.id,name:user.name,role:user.role,token:user.token});
  
}


export const checkAuth = async (req, res) => {
  if(req.user){
    res.json(req.user);
  } else{
    res.sendStatus(401);
  }
};