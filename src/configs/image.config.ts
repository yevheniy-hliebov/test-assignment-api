import * as dotenv from 'dotenv';
dotenv.config();

const imageConfig = {
  image_size_mb: Number(process.env.IMAGE_SIZE_MB!),
  image_size_px: Number(process.env.IMAGE_SIZE_PX!),
  image_valid_extensions: process.env.IMAGE_VALID_EXTENSIONS!.split(','),
  storage_path: process.env.STORAGE_PATH!,
  tinify_key: process.env.TINIFY_KEY!,
  start_url: process.env.API_URL!
}

export default imageConfig;