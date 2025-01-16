import mongoose from 'mongoose';

const S3imgSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const S3image = mongoose.model('S3image', S3imgSchema);
export default S3image;
