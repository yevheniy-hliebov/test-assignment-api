import * as fs from 'fs';
import path from 'path';
import tinify from 'tinify';
import imageConfig from '../configs/image.config';
tinify.key = imageConfig.tinify_key;

export async function imageOptimization(imageBuffer: Buffer) {
  const image = tinify.fromBuffer(imageBuffer);
  const resizedImage = image.resize({
    method: 'cover',
    width: Number(imageConfig.image_size_px),
    height: Number(imageConfig.image_size_px),
  });

  return await resizedImage.toBuffer();
}

export function saveAsJPG(buffer: Buffer | Uint8Array, fileName: string): void {
  return fs.writeFile(path.join(imageConfig.storage_path, fileName), buffer, function(err) {
    if (err) {
      console.error('Error saving file:', err);
    } else {
      console.log('Image saved successfully:', fileName);
    }
  });
}