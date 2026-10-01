import { Module } from '@nestjs/common';
import { ShortenService } from './shorten.service.js';
import { ShortenController } from './shorten.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Short, ShortSchema } from './entities/short.entity.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Short.name, schema: ShortSchema }]),
  ],
  controllers: [ShortenController],
  providers: [ShortenService],
})
export class ShortenModule {}
