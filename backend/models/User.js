import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['viewer', 'admin', 'editor'],
    default: 'viewer'
  },

  status:{
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },

  lastLogin:{
    type: Date,
    default: null
  },

  // Optional Profile Fields
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30
  },

  avatar: {
    type: String,
    default: null
  },

  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },

  phone: {
    type: String,
    trim: true,
    match: [/^[0-9+\-() ]*$/, "Invalid phone number"]
  },

  address: {
    type: String,
    default: ''
  },

  city: {
    type: String,
    default: ''
  },

  country: {
    type: String,
    default: ''
  },

  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    },
    saveHistory: {
      type: Boolean,
      default: true
    }
  }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;