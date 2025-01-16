import express from "express";
import { getURL, putURL, uploadToS3 } from "./config/s3_config.js";
import { upload } from "./config/multer.js";
import cors from "cors";
import { startDB } from "./config/mongo.js";
import S3image from "./models/S3image.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS to allow only the specified origin
const allowedOrigin = "https://s3bucket.riturajs.me";
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST"], // Restrict allowed HTTP methods
    credentials: true, // Allow credentials if needed
  })
);

startDB().catch(console.error);

app.get("/", async (req, res) => {
  console.log("running");
  res.send({ msg: "This is Express App AMAZON S3_Practice" });
});

app.get("/getimg", async (req, res) => {
  try {
    const data = await S3image.find({});

    const urls = await Promise.all(
      data.map(async (e) => {
        const url = await getURL(e.url);
        return url;
      })
    );

    res.send(urls);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send({ message: "Error fetching images" });
  }
});

app.post("/image", upload.single("s3img"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  console.log(req.file);
  try {
    // Upload the file to S3 and get the URL
    const filename = `s3image-${Date.now()}`;
    const fileDetail = await uploadToS3(
      filename,
      req.file.buffer,
      req.file.mimetype
    );
    console.log(fileDetail);
    const data = new S3image({
      url: fileDetail.filename,
    });
    await data.save();
    console.log(data);
    res.status(200).send(data);
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("App is running on port", PORT);
});
