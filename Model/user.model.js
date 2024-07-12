const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  firstname: {
    type:String,
    required: true,
  },
  lastname: {
    type:String,
    required: true,
  },
  email: {
    type:String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type:Number,
    required: true,
  },
  password: {
  type: String,
  required: true,
},
});

// Hash password before saving user
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
