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
    .cookie("jwt", "" , {
      expires: new Date(0),
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
      "https://e-commerce-sami.vercel.app/reset-password?token=" + token + "&email=" + email;
    const subject = "reset password for e-commerce";
    const html = `<strong>Click <a href ='${resetPageLink}'>here</a> to Reset Password</strong>`;

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
        const html = `<strong>Password Reset Successfully</strong>`;

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


// authentication with google

// export const googleAuth = async (req, res) => {
//   const { name, email } = req.body;

//   try {
//     // Check if the user already exists
//     let user = await User.findOne({ email });

//     if (!user) {
//       const hashedPassword = await bcrypt.hash("default-password", 10);
//       // If user does not exist, create a new one
//       user = new User({
//         name,
//         email,
//         password: hashedPassword,
//       });

//       const doc = await user.save();

//       const token = jwt.sign(sanitizeUser(doc), process.env.SECRET_KEY);
  
//       // Send the token and user data to the frontend
//       res
//         .cookie("jwt", user.token, {
//           expires: new Date(Date.now() + 3600000),
//           httpOnly: true,
//         })
//         .status(201)
//         .json({
//           id: doc.id,
//           name: doc.name,
//           role: doc.role,
//           token: token,
//         });
//     }

//     // Generate JWT for the user
//     // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//     //   expiresIn: "15d",
//     // });

//   } catch (error) {
//     console.log("Error in Google Auth:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      const salt = crypto.randomBytes(16) // Salt ko properly store karne ke liye string me convert kar diya

      crypto.pbkdf2(
        "default-password",
        salt, // Buffer me convert kiya
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (err) {
            return res.status(500).json({ error: "Error hashing password" });
          }

          user = new User({
            name,
            email,
            password: hashedPassword,// Ensure hashed password is saved as a string
            salt, // Salt properly save hoga
          });

          const doc = await user.save();

          req.login(sanitizeUser(doc), (err) => {
            if (err) {
              return res.status(400).json(err);
            }

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
          });
        }
      );
    } else {
      // Agar user already exist karta hai, toh JWT sign karke return karo
      const token = jwt.sign(sanitizeUser(user), process.env.SECRET_KEY);
      res
        .cookie("jwt", token, {
          expires: new Date(Date.now() + 3600000),
          httpOnly: true,
        })
        .status(200)
        .json({
          id: user.id,
          name: user.name,
          role: user.role,
          token: token,
        });
    }
  } catch (error) {
    console.log("Error in Google Auth:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};