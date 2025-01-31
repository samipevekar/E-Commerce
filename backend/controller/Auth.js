import { User } from "../model/User.js";
import crypto from "crypto";
import { sanitizeUser, sendMail } from "../services/common.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();

        req.login(sanitizeUser(doc), (err) => {
          // this also calls serializer and adds to session
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(doc), process.env.SECRET_KEY);
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({
                id: doc.id,
                name: doc.name,
                role: doc.role,
                token: token,
              });
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

export const loginUser = async (req, res) => {
  const user = req.user;
  res
    .cookie("jwt", user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({ id: user.id, name: user.name, role: user.role, token: user.token });
};

export const checkAuth = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};

export const logout = async (req, res) => {
  res
    .cookie("jwt", null , {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200)
};

export const resetPasswordRequest = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (user) {
    const token = crypto.randomBytes(48).toString("hex");
    user.resetPasswordToken = token;
    await user.save();

    const resetPageLink =
      "http://localhost:5173/reset-password?token=" + token + "&email=" + email;
    const subject = "reset password for e-commerce";
    const html = `<p>Click <a href ='${resetPageLink}'>here</a> to Reset Password</p>`;

    //let send email and a token in the mail body so we can verify that user has clicked right link

    if (email) {
      const response = await sendMail({ to: email, subject, html });
      res.json(response);
    } else {
      res.sendStatus(401);
    }
  } else {
    res.status(400).json({ message: "Email not found" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, password, token } = req.body;

  const user = await User.findOne({ email: email, resetPasswordToken: token });
  if (user) {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        user.password = hashedPassword;
        user.salt = salt;
        await user.save();
        const subject = "password successfully reset for e-commerce";
        const html = `<p>Successfully Reset Password</p>`;

        //let send email and a token in the mail body so we can verify that user has clicked right link
        if (email) {
          const response = await sendMail({ to: email, subject, html });
          res.json(response);
        } else {
          res.sendStatus(401);
        }
      }
    );
  } else {
    res.status(400).json({ message: "Email not found" });
  }
};
