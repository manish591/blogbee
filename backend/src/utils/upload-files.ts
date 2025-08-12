import { v2 as cloudinary } from 'cloudinary';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import multer from 'multer';
import { config } from '../config';
import { AppError } from './app-error';
import { logger } from './logger';

const storage = multer.memoryStorage();
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

export async function uploadFileToCloudinary(base64Img: string) {
  const res = await cloudinary.uploader.upload(base64Img, {
    resource_type: 'auto',
  });

  return res.url;
}

export async function uploadSingleFile(
  file: Express.Multer.File,
  uploadFileHandler: (base64Img: string) => Promise<string>,
) {
  try {
    const base64 = file.buffer.toString('base64');
    const dataURI = `data:${file.mimetype};base64,${base64}`;
    return uploadFileHandler(dataURI);
  } catch (err) {
    logger.error('An internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Failed to upload files. Try again later!',
    });
  }
}
