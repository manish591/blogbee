import { v2 as cloudinary } from 'cloudinary';
import { StatusCodes } from 'http-status-codes';
import multer from 'multer';
import { config } from '../config';
import { BlogbeeError } from './app-error';
import { logger } from './logger';

const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export async function uploadFileToCloudinary(file: Express.Multer.File) {
  cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
  });

  try {
    const base64 = file.buffer.toString('base64');
    const dataURI = `data:${file.mimetype};base64,${base64}`;

    const res = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
    });

    return res.url;
  } catch (err) {
    logger.error('An internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to upload files. Try again later!',
    );
  }
}
