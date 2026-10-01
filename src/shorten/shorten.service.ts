import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { CreateShortURLDto } from './dto/create-short-url.dto.js';
import { generateShortCode } from './short-code.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Short } from './entities/short.entity.js';
import { EnvConfigService } from '../shared/env-config/env-config.service.js';

@Injectable()
export class ShortenService {
  constructor(
    @InjectModel(Short.name) private readonly shortModel: Model<Short>,
    private readonly env: EnvConfigService,
  ) {}

  async shortenUrl(
    createShortURLDto: CreateShortURLDto,
  ): Promise<{ shortenedUrl: string }> {
    try {
      const originalUrl = createShortURLDto.url;
      const code = generateShortCode();

      const existingShort = await this.shortModel.findById(code);

      if (existingShort) {
        return await this.shortenUrl(createShortURLDto);
      }

      const shortedObject: Short = {
        _id: code,
        originalUrl,
        createdAt: new Date(),
      };

      const createdShortUrl = new this.shortModel(shortedObject);

      const savedShortUrl = await createdShortUrl.save();

      const shortenedUrl = `${this.env.get('URL_BASE')}/${savedShortUrl._id}`;

      return { shortenedUrl };
    } catch {
      throw new InternalServerErrorException('Failed to shorten URL');
    }
  }

  async findOriginalUrl(code: string): Promise<string> {
    const urlShortedExists = await this.shortModel.findById(code);

    if (!urlShortedExists) {
      throw new NotFoundException('Shortened URL not found');
    }

    return urlShortedExists.originalUrl;
  }
}
