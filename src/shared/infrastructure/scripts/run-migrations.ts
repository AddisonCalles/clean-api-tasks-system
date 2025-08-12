import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../database.providers';

// Cargar variables de entorno

async function runMigrations() {
  console.log('🚀 Iniciando ejecución de migraciones...');
  console.log('🔧 Configuración de base de datos:', dataSourceOptions);
  const dataSource = new DataSource(dataSourceOptions);

  try {
    console.log('📡 Conectando a la base de datos...');
    await dataSource.initialize();

    console.log('✅ Conexión establecida. Ejecutando migraciones...');
    const migrations = await dataSource.runMigrations();

    console.log(
      `✅ Migraciones ejecutadas exitosamente: ${migrations.length} migraciones aplicadas`,
    );

    for (const migration of migrations) {
      console.log(`  - ${migration.name}`);
    }
  } catch (error) {
    console.error('❌ Error durante la ejecución de migraciones:', error);
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
  runMigrations();
}

export { runMigrations };
