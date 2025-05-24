import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Controller to create a new user
export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Controller to handle user signup
export const signup = async (req, res) => {
  try {
    const { email, password, ...otherDetails } = req.body;

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'Email is already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, ...otherDetails });
    await user.save();
    res.status(201).send({
      message: 'User created successfully',
      userId: user._id,
      userName: `${user.firstName} ${user.lastName}`
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).send({ message: 'An error occurred during signup. Please try again later.' });
  }
};

// Controller to handle user login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: 'User not found' });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send({ message: 'Invalid password' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SEED, { expiresIn: '1h' });
    res.status(200).send({ token, user });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Controller to get user details by ID
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.status(200).send(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).send({ message: 'An error occurred while retrieving user details.' });
  }
};

// Controller to update user details
export const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
}; 