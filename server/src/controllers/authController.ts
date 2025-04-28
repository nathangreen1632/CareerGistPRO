import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../database/models/index.js';

const JWT_SECRET = process.env.JWT_SECRET!;

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password, location } = req.body;
  try {
    const existing = await db.User.findOne({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'Email already in use.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await db.User.create({
      firstName,
      lastName,
      email,
      location,
      passwordHash,
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

  export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.id;
  try {
    const user = await db.User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'location', 'role'],
    });
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching user.' });
  }
};
