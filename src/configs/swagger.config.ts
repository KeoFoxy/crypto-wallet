import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Crypto Wallet')
  .setDescription('Crypto Wallet API')
  .setVersion('1.0')
  .build();
