import path from "path";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (filePath: string, folder: string) => {
   const ext = path.extname(filePath).toLowerCase();

  // Decide resource_type automatically
  const resourceType =
    ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".gif"
      ? "image"
      : "raw";

  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: resourceType,
    type: "upload",
    folder,
  });
  return { url: result.secure_url };
};