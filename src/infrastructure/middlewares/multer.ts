import multer from "multer";
import { BadRequestError } from "../../core/common/errors/BadRequestError";

// Filter config
const filter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) => {
  if (file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png") {
    callback(null, true);
  } else {
    callback(new BadRequestError('Only images supported with format: jpeg, png.'));
  }
};

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  fileFilter: filter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  }
});
