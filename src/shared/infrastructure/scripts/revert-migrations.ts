import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '@shared/infrastructure/database.providers';

async function revertMigrations() {
  console.log('🔄 Iniciando reversión de migraciones...');

  const dataSource = new DataSource(dataSourceOptions);

  try {
    console.log('📡 Conectando a la base de datos...');
    await dataSource.initialize();

    console.log('✅ Conexión establecida. Revirtiendo migraciones...');
    await dataSource.undoLastMigration();

    console.log('✅ Migración revertida exitosamente');
  } catch (error) {
    console.error('❌ Error durante la reversión de migraciones:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar si este archivo se ejecuta directamente
if (require.main === module) {
  revertMigrations();
}

export { revertMigrations };
