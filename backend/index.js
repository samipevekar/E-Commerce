import express from "express";
import mongoose from "mongoose";
import productsRouters from "./routes/Products.js";
import categoriesRouters from "./routes/Category.js";
import brandsRouters from "./routes/Brands.js";
import userRouters from "./routes/User.js";
import authRouters from "./routes/Auth.js";
import cartRouters from "./routes/Cart.js";
import ordersRouters from "./routes/Order.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import passport from "passport";
import session from "express-session";
import { User } from "./model/User.js";
import LocalStrategy from "passport-local";
import crypto from "crypto";
import { cookieExtractor, isAuth, sanitizeUser } from "./services/common.js";
import JwtStrategy from "passport-jwt";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import path from "path";
import MongoStore from "connect-mongo"; // Persistent session store
import { fileURLToPath } from "url";

dotenv.config();

const server = express();

// Razorpay instance
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// JWT options
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.SECRET_KEY;

// Static Files Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.use(express.static(path.resolve(__dirname, "dist"))); // Serve frontend files

// Middlewares
server.use(cookieParser());
server.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // MongoDB URI for session storage
    }),
  })
);
server.use(passport.authenticate("session"));
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Routes
server.use("/products", isAuth(), productsRouters);
server.use("/categories", isAuth(), categoriesRouters);
server.use("/brands", isAuth(), brandsRouters);
server.use("/users", isAuth(), userRouters);
server.use("/auth", authRouters);
server.use("/cart", isAuth(), cartRouters);
server.use("/orders", isAuth(), ordersRouters);

// Passport Strategies
passport.use(
  "local",
  new LocalStrategy.Strategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: "invalid credentials" });

      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async (err, hashedPassword) => {
          if (err || !crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
          const token = jwt.sign(sanitizeUser(user), process.env.SECRET_KEY);
          done(null, { id: user.id, name: user.name, role: user.role, token });
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy.Strategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) return done(null, sanitizeUser(user));
      return done(null, false);
    } catch (err) {
      done(err, false);
    }
  })
);

passport.serializeUser((user, cb) =>
  process.nextTick(() => cb(null, { id: user.id, role: user.role }))
);

passport.deserializeUser((user, cb) =>
  process.nextTick(() => cb(null, user))
);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Default Route
server.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


// Export for Vercel
export default server;

// Start Locally (Optional)
if (process.env.NODE_ENV !== "production") {
  server.listen(8080, () => console.log("Server started on port 8080"));
}
