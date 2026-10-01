import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Redirect,
} from '@nestjs/common';
import { ShortenService } from './shorten.service.js';
import type { CreateShortURLDto } from './dto/create-short-url.dto.js';

@Controller()
export class ShortenController {
  constructor(private readonly shortenService: ShortenService) {}

  @Post('shorten')
  createShortURL(@Body() createShortURLDto: CreateShortURLDto) {
    return this.shortenService.shortenUrl(createShortURLDto);
  }

  @Get(':code')
  @Redirect()
  async redirect(@Param('code') code: string) {
    const url = await this.shortenService.findOriginalUrl(code);

    return { url, statusCode: HttpStatus.FOUND };
  }
}
