import {
  Injectable,
  UnsupportedMediaTypeException,
  InternalServerErrorException,
} from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path, { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import sharp from 'sharp';

const pump = promisify(pipeline);

@Injectable()
export class UploadService {
  private baseUploadPath = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!existsSync(this.baseUploadPath)) {
      mkdirSync(this.baseUploadPath, { recursive: true });
    }
  }

  async saveFile(file: any, folder: string = ''): Promise<any> {
    const allowedTypes = [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/ico',
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new UnsupportedMediaTypeException(
        'نوع فایل پشتیبانی نمی‌شود. فقط تصاویر JPEG، PNG، WebP، ICO و HEIC مجاز هستند.',
      );
    }

    const isHeic = file.mimetype === 'image/heic';

    const newFileName = `${uuidv4()}.${isHeic ? 'jpg' : this.getExtensionFromMime(file.mimetype).slice(1)}`;
    const targetFolder = join(this.baseUploadPath, folder);

    if (!existsSync(targetFolder)) {
      mkdirSync(targetFolder, { recursive: true });
    }

    const outputPath = join(targetFolder, newFileName);

    try {
      if (isHeic) {
        // تبدیل HEIC به JPEG با استفاده از sharp
        const chunks: any = [];
        for await (const chunk of file.file) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        const convertedBuffer = await sharp(buffer).jpeg().toBuffer();
        writeFileSync(outputPath, convertedBuffer);
      } else {
        console.log(`Saving file to ${outputPath}`);
        await pump(file.file, createWriteStream(outputPath));
      }
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('خطا در ذخیره یا تبدیل فایل.');
    }

    return { filename: `/uploads/${folder}/${newFileName}` };
  }

  private getExtensionFromMime(mime: string): string {
    switch (mime) {
      case 'image/jpg':
      case 'image/jpeg':
        return '.jpg';
      case 'image/png':
        return '.png';
      case 'image/webp':
        return '.webp';
      case 'image/heic':
        return '.heic';
      case 'image/ico':
        return '.ico';
      default:
        return '';
    }
  }
}
