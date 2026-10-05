import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { CreateShortURLDto } from './dto/create-short-url.dto.js';
import { generateShortCode } from './short-code.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Short } from './entities/short.entity.js';
import { EnvConfigService } from '../shared/env-config/env-config.service.js';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

const cacheKey = (code: string) => `short:${code}`;

@Injectable()
export class ShortenService {
  private readonly logger = new Logger(ShortenService.name);

  constructor(
    @InjectModel(Short.name) private readonly shortModel: Model<Short>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

      await this.cacheSet(code, originalUrl);

      const shortenedUrl = `${this.env.get('URL_BASE')}/${savedShortUrl._id}`;

      return { shortenedUrl };
    } catch {
      throw new InternalServerErrorException('Failed to shorten URL');
    }
  }

  async findOriginalUrl(code: string): Promise<string> {
    const cachedUrl = await this.cacheGet(code);

    if (cachedUrl) return cachedUrl;

    const urlShortedExists = await this.shortModel.findById(code).lean();

    if (!urlShortedExists) {
      throw new NotFoundException('Shortened URL not found');
    }

    await this.cacheSet(code, urlShortedExists.originalUrl);

    return urlShortedExists.originalUrl;
  }

  private async cacheGet(code: string) {
    try {
      return await this.cacheManager.get<string>(cacheKey(code));
    } catch (err) {
      this.logger.warn(`Cache get failed: ${String(err)}`);
      return undefined;
    }
  }

  private async cacheSet(code: string, url: string) {
    try {
      await this.cacheManager.set(cacheKey(code), url);
    } catch (err) {
      this.logger.warn(`Cache set failed: ${String(err)}`);
    }
  }
}
