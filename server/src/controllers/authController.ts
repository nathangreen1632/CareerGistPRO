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
      {
        sub: newUser.id,
        email: newUser.email,
        role: newUser.role,
        aud: 'pydatapro_user',
        iss: 'PyDataPro',
      },
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
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        aud: 'pydatapro_user',
        iss: 'PyDataPro',
      },
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

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No token provided.' });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as {
      sub: string;
      email: string;
      role: string;
      exp: number;
    };

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now - 120) {
      res.status(403).json({ error: 'Token expired too long ago. Please log in again.' });
      return;
    }

    const newToken = jwt.sign(
      {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
        aud: 'pydatapro_user',
        iss: 'PyDataPro',
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );


    res.json({ token: newToken });
  } catch (err) {
    console.error('❌ Token refresh failed:', err);
    res.status(403).json({ error: 'Invalid token.' });
  }
};
