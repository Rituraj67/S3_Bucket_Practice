import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

// for generating url for accessing file thru get req
export const getURL = async (path) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: path,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 600 });
  return url;
};

// for generating url for put req..
export const putURL = async (filename, contentType) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/images/${filename}`,
    ContentType: contentType,
  });
  const url = await getSignedUrl(s3Client, command);
  return url;
};

export const uploadToS3 = async (fileName, fileBuffer, fileType) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, // Your S3 bucket name
    Key: `uploads/images/${fileName}`, // The path to store the file in the bucket
    Body: fileBuffer, // The file data
    ContentType: fileType, // The file's MIME type
    ACL: "private", // Permissions for the file (set to 'private' for restricted access)
  };

  try {
    // Upload file to S3
    const command = new PutObjectCommand(params);

    const data = await s3Client.send(command);
    console.log(data);
    console.log("File uploaded successfully:", data);
    return {
      bucket: process.env.AWS_BUCKET_NAME,
      filename: `uploads/images/${fileName}`,
    };
  } catch (error) {
    console.error("Error uploading to S3:");
    throw error;
  }
};
