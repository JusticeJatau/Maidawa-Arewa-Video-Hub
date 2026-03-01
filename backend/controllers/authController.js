import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if(!name || !email || !password){
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if(user){
        res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token:generateToken(user._id, user.role)
        });
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({ message: 'Please provide all required fields' });
    }  
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      await User.findByIdAndUpdate(user._id, {
        lastLogin: new Date(),
      })

      res.status(200).json({
        user:{
          name: user.name,
          email: user.email, 
          role: user.role,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        },
        token: generateToken(user._id, user.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }  
    } catch (error) {
    console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const logout = async (req, res) => {
  // Since JWTs are stateless, logout can be handled on the client side by deleting the token.
  res.status(200).json({ message: 'User logged out successfully' });
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

export { register, login, logout, getMe };