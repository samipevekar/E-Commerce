# E-Commerce Website (MERN Stack)

An e-commerce website built using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js), where users can browse and order products. The platform integrates a **secure payment gateway (Razorpay)** for transactions and features an **admin panel** for product management.

## 🚀 Live Demo

🔗 **Live Website:** [E-Commerce Website](https://e-commerce-sami.vercel.app/)

---

## 📌 Features

### User Features:
- Browse and search for products.
- Add products to the cart and proceed to checkout.
- Secure payment processing with **Razorpay**.
- User authentication (Signup/Login/Logout).
- Order history tracking.

### Admin Features:
- Add, update, and delete products.
- View and manage user orders.
- Admin authentication and dashboard access.

---

## 🛠️ Tech Stack

### Frontend:
- **React.js** (Vite for faster builds)
- **Tailwind CSS** (for styling)
- **React Router** (for navigation)

### Backend:
- **Node.js** & **Express.js** (REST API)
- **MongoDB** & **Mongoose** (Database & ORM)
- **JWT Authentication** (for secure access control)
- **Razorpay API** (for payments)

### Deployment:
- **Frontend:** Vercel
- **Backend:** Render / Railway / DigitalOcean
- **Database:** MongoDB Atlas

---

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/samipevekar/E-Commerce.git
   cd E-commerce
   ```

2. **Backend Setup**
   ```sh
   cd backend
   npm install
   npm start
   ```

3. **Frontend Setup**
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

4. **Environment Variables**
   Create a `.env` file in the root of the backend directory and add:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_SECRET=your_razorpay_secret
   MAIL_PASSWORD = your_mail_password
   ```



