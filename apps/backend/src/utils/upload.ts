import { unlinkSync } from 'node:fs';
import { v2 as cloudinary } from 'cloudinary';
import { StatusCodes } from 'http-status-codes';
import multer from 'multer';
import { config } from '../config';
import { BlogbeeError } from './app-error';
import { logger } from './logger';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, './public/temp')
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname)
  }
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export async function uploadFileToCloudinary(localFilePath: string) {
  try {
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    if (!res.url) {
      throw new Error("UPLOAD_FILE_FAILED: Failed to upload file");
    }

    unlinkSync(localFilePath);
    return res.url;
  } catch (err) {
    unlinkSync(localFilePath);
    logger.error('An internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to upload files. Try again later!',
    );
  }
}
