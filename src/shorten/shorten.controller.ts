import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Redirect,
  UseFilters,
} from '@nestjs/common';
import { ShortenService } from './shorten.service.js';
import {
  shortUrlSchema,
  type CreateShortURLDto,
} from './dto/create-short-url.dto.js';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe.js';
import { ShortUrlNotFoundFilter } from './filters/short-url-not-found.filter.js';

@Controller()
export class ShortenController {
  constructor(private readonly shortenService: ShortenService) {}

  @Post('shorten')
  createShortURL(
    @Body(new ZodValidationPipe(shortUrlSchema))
    createShortURLDto: CreateShortURLDto,
  ) {
    return this.shortenService.shortenUrl(createShortURLDto);
  }

  @Get(':code')
  @Redirect()
  @UseFilters(ShortUrlNotFoundFilter)
  async redirect(@Param('code') code: string) {
    const url = await this.shortenService.findOriginalUrl(code);

    return { url, statusCode: HttpStatus.FOUND };
  }
}
