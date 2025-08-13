import { Provider } from '@nestjs/common';
import { taskEntities } from '@tasks/infrastructure/typeorm/entities';
import { taskMigrations } from '@tasks/infrastructure/typeorm/migrations';
import { userEntities } from '@users/infrastructure/typeorm/entities';
import { userMigrations } from '@users/infrastructure/typeorm/migrations';
import { DataSource, DataSourceOptions } from 'typeorm';
const MIGRATIONS_PATH = '/**/migrations/**/*{.ts,.js}';
console.log('MIGRATIONS PATH:', MIGRATIONS_PATH);

export const dataSourceOptions: DataSourceOptions = {
  // USAR SERVICIO PARA ALMACENAMIENTO DE SECRETOS EN PRODUCCIÓN COMO (SECRET MANAGER DE AWS)
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [...taskEntities, ...userEntities],
  migrations: [...userMigrations, ...taskMigrations],
  synchronize: false,
};
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
