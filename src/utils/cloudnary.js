import { v2 as cloudnary } from "cloudinary";
import fs from "fs";

cloudnary.config({
  cloud_name: process.env.CLOUDNARY_SERVER_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_KEY_SECRET,
});

const uploadFileOnCloudnary = async (localPath) => {
  try {
    if (!localPath) return null;
    // upload on cloudnary
    const response = await cloudnary.uploader.upload(localPath, {
      resource_type: "auto",
    });

    // file uploaded sucessfully
    fs.unlinkSync(localPath);
    console.log(response.secure_url);
    return response;
  } catch (error) {
    fs.unlinkSync(localPath);
    return null;
  }
};

export { uploadFileOnCloudnary };
