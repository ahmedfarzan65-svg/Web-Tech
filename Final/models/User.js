const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  },
  role: { 
    type: String, 
    default: 'customer', 
    enum: ['customer', 'admin'] 
  }
});

// Pre-save Middleware Hook: Automatically hash the password before saving to the database
//  CORRECT: Simply omit 'next' completely when writing an async function
userSchema.pre('save', async function() {
    // If the password hasn't changed, skip doing anything
    if (!this.isModified('password')) return;

    // Securely hash the password automatically
    const bcrypt = require('bcryptjs');
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);