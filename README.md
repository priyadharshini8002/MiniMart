# 🛍️ MiniMart – Indian E-Commerce Website

MiniMart is a complete online shopping website for Indian customers, built with the **MERN stack** (MongoDB, Express.js, React, Node.js).

Made for the **SAM AI Technologies Internship – Web Development Task 5**.

---

## 1. Project Objectives

Build a working Indian online store where users can:

- Browse, search and filter products
- View product details
- Register and log in
- Add products to a cart, change quantities and remove items
- Check out with an Indian delivery address
- Pay with **Cash on Delivery** or **Razorpay (test mode)**
- Receive an order confirmation and see their past orders

## 2. Features

| Area | What it does |
|------|--------------|
| Products | 30 Indian products in 8 categories, prices in ₹, ratings, stock |
| Search & filter | Search by name/brand, filter by category and price range, sort by price or discount |
| Authentication | Register, login, logout. Passwords hashed with bcryptjs, sessions with JWT |
| Cart | Saved in MongoDB per user. Add, remove, +/- quantity, stock limit, delivery charge |
| Checkout | Indian address form (state list, 6-digit PIN, +91 phone) with validation |
| Payments | Cash on Delivery and Razorpay with backend signature verification |
| Orders | Unique Order ID (e.g. `MM-20261105-4821`), confirmation page, My Orders page |
| Profile | View and edit name, phone, address, city, state, PIN code |
| Design | Brown / white / cream theme, responsive for desktop, tablet and mobile |

**Delivery rule:** free delivery for orders of ₹499 or more, otherwise ₹40.

**Cart and login:** you must be logged in to add items to the cart (the cart is stored in the database against your account).

## 3. Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript, React.js (Vite), React Router DOM, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, bcryptjs
- **Payment:** Razorpay (test mode)

## 4. Folder Structure

```
MiniMart/
├── frontend/
│   ├── public/products/        (product pictures)
│   ├── scripts/                (picture generator)
│   └── src/
│       ├── components/         Navbar, Footer, ProductCard, ...
│       ├── context/            Auth, Cart and Toast (shared data)
│       ├── hooks/              useAddToCart
│       ├── pages/              the 14 pages (+ policy and 404)
│       ├── services/           api.js (Axios), razorpay.js
│       ├── styles/             separate CSS files
│       ├── utils/              constants and helper functions
│       ├── App.jsx             routes
│       └── main.jsx            starting point
├── backend/
│   ├── config/db.js            MongoDB connection
│   ├── controllers/            the logic of each API
│   ├── middleware/             login check, error handling
│   ├── models/                 User, Product, Cart, Order, Payment
│   ├── routes/                 API addresses
│   ├── seed/                   sample products + seed script
│   ├── utils/                  validators, pricing, order helper
│   ├── server.js
│   └── .env.example
├── README.md
└── .gitignore
```

## 5. Installation

### Requirements
- **Node.js 18 or newer** – https://nodejs.org
- **MongoDB** – either
  - *MongoDB Community Server* installed on your computer, or
  - a free *MongoDB Atlas* cloud database – https://www.mongodb.com/atlas

### Backend setup
```bash
cd backend
npm install
cp .env.example .env        # Windows CMD: copy .env.example .env
```
Open `backend/.env` and fill in the values (see section 6).

Add the sample products (run once, and again any time you want to reset products):
```bash
npm run seed
```
Start the backend:
```bash
npm run dev
```
It runs at http://localhost:5000 – open http://localhost:5000/api/health to check.

### Frontend setup
Open a **second** terminal:
```bash
cd frontend
npm install
npm run dev
```
It runs at http://localhost:5173.

## 6. Environment Variables (`backend/.env`)

| Variable | Meaning |
|----------|---------|
| `PORT` | Backend port (5000) |
| `MONGO_URI` | MongoDB address. Local: `mongodb://127.0.0.1:27017/minimart`. Atlas: the connection string from the Atlas website (replace `<password>`) |
| `JWT_SECRET` | Any long random text used to sign login tokens |
| `RAZORPAY_KEY_ID` | Razorpay **test** Key ID (starts with `rzp_test_`) |
| `RAZORPAY_KEY_SECRET` | Razorpay **test** Key Secret |

⚠️ Never upload `.env` to GitHub (it is already listed in `.gitignore`).

## 7. How to Run the Website

1. Start MongoDB (local) – or use Atlas.
2. Terminal 1: `cd backend && npm run dev`
3. Terminal 2: `cd frontend && npm run dev`
4. Open http://localhost:5173

## 8. Payment Gateway Setup (Razorpay Test Mode)

Cash on Delivery works without any setup. For online payment:

1. Create a free account at https://razorpay.com and log in to the dashboard.
2. Switch to **Test Mode** (toggle at the top).
3. Go to **Account & Settings → API Keys → Generate Test Key**.
4. Copy the **Key ID** and **Key Secret** into `backend/.env`.
5. Restart the backend.
6. At checkout choose *Pay Online (Razorpay)*. In test mode use Razorpay's test details, for example:
   - Card: `4111 1111 1111 1111`, any future expiry, any CVV
   - UPI: `success@razorpay`

   (Razorpay can change test details – see https://razorpay.com/docs/payments/payments/test-card-details/)

**How the payment is kept secure**
1. The backend calculates the amount from the cart in the database and creates the Razorpay order.
2. The browser only receives the public Key ID – the secret key never leaves the server.
3. After payment, the browser sends the payment id and signature to `/api/payment/verify`.
4. The backend recomputes the signature (HMAC-SHA256) with the secret key. Only if it matches is the payment marked **Paid** and the order created.

If the keys are missing, the Razorpay option shows a friendly message and COD still works.

## 9. API Endpoints

| Method | URL | Login needed | Purpose |
|--------|-----|:---:|---------|
| POST | `/api/auth/register` | | Create account |
| POST | `/api/auth/login` | | Login |
| GET | `/api/auth/me` | ✅ | Current user |
| GET | `/api/products` | | List (query: `search`, `category`, `minPrice`, `maxPrice`, `sort`, `featured`, `limit`) |
| GET | `/api/products/:id` | | One product |
| GET | `/api/cart` | ✅ | View cart |
| POST | `/api/cart` | ✅ | Add `{ productId, quantity }` |
| PUT | `/api/cart/:productId` | ✅ | Set `{ quantity }` |
| DELETE | `/api/cart/:productId` | ✅ | Remove item |
| POST | `/api/orders` | ✅ | Place Cash on Delivery order |
| GET | `/api/orders/my-orders` | ✅ | My orders |
| GET | `/api/orders/:id` | ✅ | One order |
| GET | `/api/users/profile` | ✅ | View profile |
| PUT | `/api/users/profile` | ✅ | Update profile |
| POST | `/api/payment/create-order` | ✅ | Create Razorpay order |
| POST | `/api/payment/verify` | ✅ | Verify payment and create order |

## 10. Product Pictures

The pictures in `frontend/public/products/` are simple brown/cream illustrations generated by `npm run images` (in the frontend folder), so the site works offline. To use real photos, save your own images in that folder with the **same file names**, or change the `image` paths in `backend/seed/seedProducts.js` and run `npm run seed` again.

## 11. Testing Checklist

Run through this with both servers running:

- [ ] Register a new user (try wrong email / short password to see errors)
- [ ] Logout, then login again
- [ ] Products page loads items from MongoDB
- [ ] Search "boat" – boAt products appear
- [ ] Filter by category and by price; sort by price
- [ ] Open a product details page
- [ ] Add to cart while logged out → sent to Login
- [ ] Add to cart, increase/decrease quantity, remove an item
- [ ] Try adding more than the stock (Campus shoes have only 3 in stock)
- [ ] Woodland belt shows *Out of stock* and cannot be added
- [ ] Checkout with invalid PIN / phone shows errors
- [ ] Place a Cash on Delivery order → confirmation page → appears in *My Orders*
- [ ] Check the `orders` collection in MongoDB (Compass or Atlas) and see stock reduced
- [ ] Edit and save your profile; reload and check it stays
- [ ] Razorpay test payment (after adding keys) → order shows *Paid*
- [ ] Resize the browser / use phone view – menu button (☰) appears

## 12. Upload to GitHub

```bash
cd MiniMart
git init
git add .
git commit -m "MiniMart - MERN e-commerce project"
git branch -M main
git remote add origin https://github.com/<your-username>/MiniMart.git
git push -u origin main
```
Create the empty repository on github.com first. Check that `.env` and `node_modules` are **not** uploaded.

## 13. Screenshots

Add your screenshots to a `screenshots/` folder and list them here:

| Page | Screenshot |
|------|-----------|
| Home | `screenshots/home.png` |
| Products | `screenshots/products.png` |
| Product Details | `screenshots/details.png` |
| Cart | `screenshots/cart.png` |
| Checkout | `screenshots/checkout.png` |
| Payment | `screenshots/payment.png` |
| Order Confirmation | `screenshots/confirmation.png` |
| Mobile view | `screenshots/mobile.png` |

## 14. Author

Your Name – SAM AI Technologies Web Development Internship, Task 5.
