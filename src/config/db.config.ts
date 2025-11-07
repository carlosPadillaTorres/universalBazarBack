import { InternalServerErrorException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// En producción usa MONGO_ATLAS_URL, en desarrollo DATABASE_URL
const MONGOURI = 
  process.env.MONGO_ATLAS_URL;

if (!MONGOURI || MONGOURI === 'ERROR_MONGO_URL_NOT_FOUND') {
  throw new InternalServerErrorException('Variable de entorno de MongoDB no encontrada');
}

// Log de conexión (sin mostrar contraseña completa)
const maskedUri = MONGOURI.replace(/:([^@]+)@/, ':****@');
console.log('🔌 Intentando conectar a MongoDB...');
console.log('📍 URI:', maskedUri);

// Extraer el nombre de la base de datos de la URL si existe
const dbNameMatch = MONGOURI.match(/\/([^/?]+)(\?|$)/);
const dbName = process.env.MONGO_INITDB_DATABASE || (dbNameMatch ? dbNameMatch[1] : 'test');
console.log('📊 Base de datos:', dbName);

export const MongoConnection = MongooseModule.forRoot(MONGOURI, {
  retryWrites: true,
  w: 'majority',
  dbName: dbName, // Especificar explícitamente el nombre de la BD
});