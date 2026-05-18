const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const { MongoStore } = require('connect-mongo');
const connectDB = require('./config/db');

const app = express();

// Initialize Database Connection
connectDB();

// Dynamic Template Engine Configurations
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Core Body Parsers & Static Directory Declarations
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure Express Session Storage backed up by connect-mongo
app.use(session({
  secret: 'your_super_secret_session_key', // Replace with your actual secret string
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/noirStepsDB',
    collectionName: 'sessions'
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Initialize Flash Messages layer
app.use(flash());

// GLOBAL TEMPLATE VARIABLES MIDDLEWARE
// Inject variables accessible across all EJS layout scopes automatically
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // Access logged in profiles anywhere
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Import Decoupled MVC Routers
const publicRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes'); // New Authentication Endpoints

// Map Global App Routes
app.use('/', publicRoutes);
app.use('/', authRoutes);
app.use('/admin', adminRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`System running seamlessly on: http://localhost:${PORT}`);
});