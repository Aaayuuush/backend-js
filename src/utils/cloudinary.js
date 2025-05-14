import { v2 as cloudinary} from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Log the config to verify (remove in production)
console.log("Cloudinary configuration:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET?.substring(0, 5) + '...' // Only log part of the secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) {
            console.log("No file path provided");
            return null;
        }
        if (!fs.existsSync(localFilePath)) {
            console.error("File does not exist at path:", localFilePath);
            return null;
        }
        
        //upload the file on cloudinary
        const normalizedPath = localFilePath.replace(/\\/g, "/");
        console.log("Uploading to Cloudinary:", normalizedPath);
        const response = await cloudinary.uploader.upload(normalizedPath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
       // console.log("file is uploaded on cloudinary", response);
        fs.unlinkSync(localFilePath); // Clean up the local file after successful upload
        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        // Don't delete the file on error so we can debug
        return null;
    }
}

export {uploadOnCloudinary}