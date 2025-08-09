/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Provider } from '@nestjs/common';
import { entities } from '@tasks/infrastructure/typeorm/entities';
import { DataSource, DataSourceOptions } from 'typeorm';

const dataSourceOptions: DataSourceOptions = {
  // USAR SERVICIO PARA ALMACENAMIENTO DE SECRETOS EN PRODUCCIÓN COMO (SECRET MANAGER DE AWS)
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [...entities],
  synchronize: true, // TODO: Remove this in production
};

console.log('DATABASE CONFIGURATION:', dataSourceOptions);
export const databaseProviders: Provider[] = [
  {
    provide: process.env.DATA_SOURCE!,
    useFactory: async () => {
      const dataSource = new DataSource(dataSourceOptions);

      try {
        console.log('Inicializando Data Source!');
        return await dataSource.initialize();
      } catch (error) {
        console.error('Error during Data Source initialization', error);
      }
    },
  },
];
