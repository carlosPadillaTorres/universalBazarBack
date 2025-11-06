import { InternalServerErrorException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

const MONGOURI = process.env.MONGO_ATLAS_URL || 'mongodb://localhost:27017/';

if (MONGOURI === 'ERROR_MONGO_URL_NOT_FOUND') {
  throw new InternalServerErrorException('Variable de entono no encontrada');
}

export const MongoConnection = MongooseModule.forRoot(MONGOURI);