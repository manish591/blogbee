import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { config } from '../../config';
import { collections } from '../../lib/db';
import { logger } from '../../lib/winston';
import { UserRole, type Users } from '../../models/users.model';

async function createUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    const isUserExists = (await collections.users?.findOne({ email })) as Users;

    if (isUserExists) {
      res.status(409).json({
        message: 'Conflict',
      });

      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData = await collections.users?.insertOne({
      email,
      name,
      userRole: UserRole.USER,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!userData) {
      throw new Error('Failed To Insert The Document');
    }

    const sessionId = crypto.randomBytes(32).toString('hex');

    const sessionData = await collections.session?.insertOne({
      sessionId,
      revoked: false,
      expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      userId: userData.insertedId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!sessionData) {
      throw new Error('Failed To Insert The Document');
    }

    res.cookie(config.SESSION_COOKIE_OPTIONS.NAME, sessionId, {
      secure: config.SESSION_COOKIE_OPTIONS.SECURE,
      httpOnly: config.SESSION_COOKIE_OPTIONS.HTTP_ONLY,
      sameSite: config.SESSION_COOKIE_OPTIONS.SAME_SITE,
      maxAge: config.SESSION_COOKIE_OPTIONS.MAX_AGE,
    });

    res.status(201).json({
      message: 'User Created',
    });
  } catch (err) {
    logger.error('Internal Server Error', err);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}

async function loginUser(_req: Request, res: Response) {
  res.status(200).json({
    message: 'login successful',
  });
}

async function logoutUser(_req: Request, res: Response) {
  res.status(200).json({
    message: 'logout successful',
  });
}

async function updateUserProfile(_req: Request, res: Response) {
  res.status(200).json({
    message: 'Updated',
  });
}

async function uploadProfilePhoto(_req: Request, res: Response) {
  res.status(200).json({
    message: 'uploaded',
  });
}

async function getUserDetails(_req: Request, res: Response) {
  res.status(200).json({
    message: 'success',
  });
}

export const usersControllers = {
  createUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  uploadProfilePhoto,
  getUserDetails,
};
