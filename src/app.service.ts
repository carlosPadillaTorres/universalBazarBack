import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectConnection() private connection: Connection) {}

  getHello(): string {
    return 'Bazar Universal API is running! 🚀';
  }

  async getHealthCheck() {
    const dbState = this.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    try {
      // Obtener información de la base de datos
      const dbName = this.connection.db?.databaseName || 'unknown';
      const host = this.connection.host || 'unknown';
      
      // Obtener todas las colecciones
      const collections = await this.connection.db?.listCollections().toArray() || [];
      const collectionNames = collections.map(col => col.name);

      // Contar documentos en la colección de productos si existe
      let productsCount = 0;
      if (collectionNames.includes('products')) {
        productsCount = await this.connection.db?.collection('products').countDocuments() || 0;
      }

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: {
          state: states[dbState],
          stateCode: dbState,
          connected: dbState === 1,
          name: dbName,
          host: host,
          collections: collectionNames,
          collectionsCount: collectionNames.length,
        },
        products: {
          count: productsCount,
          collectionExists: collectionNames.includes('products'),
        },
        environment: {
          nodeEnv: process.env.NODE_ENV || 'development',
          port: process.env.PORT || process.env.APP_PORT || 3000,
          mongoUrl: process.env.MONGO_ATLAS_URL ? 
            this.maskConnectionString(process.env.MONGO_ATLAS_URL) : 
            (process.env.DATABASE_URL ? 'Using DATABASE_URL' : 'Not set'),
        }
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: {
          state: states[dbState],
          stateCode: dbState,
          connected: false,
          error: error.message,
        },
        environment: {
          nodeEnv: process.env.NODE_ENV || 'development',
          port: process.env.PORT || process.env.APP_PORT || 3000,
        }
      };
    }
  }

  private maskConnectionString(url: string): string {
    // Ocultar la contraseña en la URL de conexión
    return url.replace(/:([^@]+)@/, ':****@');
  }
}
