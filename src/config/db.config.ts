import { InternalServerErrorException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// En producción usa MONGO_ATLAS_URL, en desarrollo DATABASE_URL
const MONGOURI = 
  process.env.MONGO_ATLAS_URL || 
  process.env.DATABASE_URL || 
  'mongodb://localhost:27017/';

if (!MONGOURI || MONGOURI === 'ERROR_MONGO_URL_NOT_FOUND') {
  throw new InternalServerErrorException('Variable de entorno de MongoDB no encontrada');
}

console.log('🔌 Conectando a MongoDB...');

export const MongoConnection = MongooseModule.forRoot(MONGOURI, {
  retryWrites: true,
  w: 'majority',
});