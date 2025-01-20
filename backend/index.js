import express from "express";
import mongoose, { sanitizeFilter } from "mongoose";
import productsRouters from "./routes/Products.js";
import categoriesRouters from "./routes/Category.js";
import brandsRouters from "./routes/Brands.js";
import userRouters from "./routes/User.js";
import authRouters from "./routes/Auth.js";
import cartRouters from "./routes/Cart.js";
import ordersRouters from "./routes/Order.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from 'jsonwebtoken'
import passport from "passport";
import session from "express-session";
import { User } from "./model/User.js";
import LocalStrategy from 'passport-local'
import crypto from 'crypto'
import {cookieExtractor, isAuth, sanitizeUser} from "./services/common.js";
import JwtStrategy from 'passport-jwt'
import ExtractJwt from 'passport-jwt'
import Razorpay from 'razorpay'
import dotenv from 'dotenv'
import path from "path";
import { fileURLToPath } from "url";

dotenv.config()


const server = express();

// JWT options


const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.SECRET_KEY; // TODO: should not be in code;

//middlewares
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.use(express.static(path.resolve(__dirname,'dist')))

server.use(cookieParser());
server.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate('session'));
server.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
  })
);

server.use(express.json());
server.use(express.urlencoded({extended:true}))

server.use("/products",isAuth(), productsRouters);
server.use("/categories",isAuth(), categoriesRouters);
server.use("/brands",isAuth(), brandsRouters);
server.use("/users",isAuth(), userRouters);
server.use("/auth", authRouters);
server.use("/cart",isAuth(), cartRouters);
server.use("/orders",isAuth(), ordersRouters);


// Passport Strategies
passport.use(
  'local',
  new LocalStrategy.Strategy(
    {usernameField:'email'},
    async function (email, password, done) {
    // by default passport uses username
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: 'invalid credentials' }); // for safety
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        'sha256',
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: 'invalid credentials' });
          }
          const token = jwt.sign(sanitizeUser(user), process.env.SECRET_KEY);
          done(null, {id:user.id,name:user.name, role:user.role, token}); // this lines sends to serializer
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  'jwt',
  new JwtStrategy.Strategy(opts, async function (jwt_payload, done) {
    console.log({ jwt_payload });
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  console.log('serialize', user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this changes session variable req.user when called from authorized request

passport.deserializeUser(function (user, cb) {
  console.log('de-serialize', user);
  process.nextTick(function () {
    return cb(null, user);
  });
});


main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
}

server.get("/", (req, res) => {
  res.json({ status: "success" });
});


// razor pay instance payment gateway
export const instance = new Razorpay({
  key_id:process.env.RAZORPAY_API_KEY,
  key_secret:process.env.RAZORPAY_API_SECRET
})



server.listen(8080, () => {
  console.log("Server started");
});
