const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoute = require('./routes/userRoute');
const botRoute = require('./routes/botRoute');
const reportRoute = require('./routes/reportRoute');
// 🌐 CORS config (כולל credentials)
app.use(cors({
  origin: ['https://neurochat-frontend.onrender.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());


app.set('trust proxy', 1); // חשוב מאוד ברנדר!

// 🛡️ Session config (מותאם ל-prod ו-dev)
const isProduction = process.env.NODE_ENV === 'production';

app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
  cookie: {
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 ימים
    secure: isProduction,           // חובה ב-HTTPS
    sameSite: isProduction ? 'None' : 'Lax' // כדי לא לחסום cross-origin
  }
}));

// 📦 Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((error) => console.log(error));

// 🚏 Routes
app.use('/auth', authRoute);
app.use('/bot', botRoute);
app.use('/report', reportRoute);

// 🚀 Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});