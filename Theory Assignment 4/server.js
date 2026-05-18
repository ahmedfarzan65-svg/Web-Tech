const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

// Instantiate Express App
const app = express();

// Initialize Database Connection
connectDB();

// Dynamic Template Engine Hook & Global View Targets 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Core Middlewares
app.use(express.urlencoded({ extended: true })); // Essential for parsing form payloads!
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Auto-Seeder Trigger Setup
const Product = require('./models/Product');
async function seedDatabaseIfEmpty() {
  const count = await Product.countDocuments();
  if (count === 0) {
    const sampleShoes = [
      { name: "Vortex Runner Pro", price: 5000, category: "Men", rating: 4.5, stock: 15, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" },
      { name: "Luna Heel Deluxe", price: 7000, category: "Women", rating: 4.8, stock: 8, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80" },
      { name: "Horizon Skate Classic", price: 2000, category: "Unisex", rating: 4.2, stock: 25, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80" }
    ];
    await Product.insertMany(sampleShoes);
    console.log('Initial collection base seeded successfully.');
  }
}
seedDatabaseIfEmpty();

// Modular Route Directives Split Architecture
const publicRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', publicRoutes);
app.use('/admin', adminRoutes); // Prepend "/admin" ahead of all dashboard operations

// Startup Listen Port Hook
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server executing successfully. Navigate to: http://localhost:${PORT}`);
});