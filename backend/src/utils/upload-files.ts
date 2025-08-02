import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config";
import { AppError } from "./app-error";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { logger } from "./logger";

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET
});

export async function uploadSingleFile(file: Express.Multer.File) {
  try {
    const base64 = file.buffer.toString("base64");
    let dataURI = "data:" + file.mimetype + ";base64," + base64;
    const res = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
    });
    return res.url;
  } catch (err) {
    logger.error('An internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Failed to upload files. Try again later!',
    });
  }
}