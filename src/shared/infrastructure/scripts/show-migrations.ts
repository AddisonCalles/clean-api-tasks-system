import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../database.providers';

async function showMigrations() {
  console.log('📊 Mostrando estado de migraciones...');

  const dataSource = new DataSource(dataSourceOptions);

  try {
    console.log('📡 Conectando a la base de datos...');
    await dataSource.initialize();

    console.log('✅ Conexión establecida. Consultando migraciones...');

    // Obtener migraciones ejecutadas
    const executedMigrations = await dataSource.query(
      'SELECT * FROM migrations ORDER BY timestamp',
    );

    // Obtener migraciones pendientes
    const pendingMigrations: any = await dataSource.showMigrations();

    console.log('\n📋 Migraciones ejecutadas:');
    if (executedMigrations.length === 0) {
      console.log('  - Ninguna migración ejecutada');
    } else {
      executedMigrations.forEach((migration: any) => {
        console.log(
          `  ✅ ${migration.name} (${new Date(migration.timestamp).toLocaleString()})`,
        );
      });
    }

    console.log('\n⏳ Migraciones pendientes:');
    if (pendingMigrations.length === 0) {
      console.log('  - No hay migraciones pendientes');
    } else {
      pendingMigrations.forEach((migration: any) => {
        console.log(`  ⏸️ ${migration.name}`);
      });
    }

    console.log(
      `\n📈 Total: ${executedMigrations.length} ejecutadas, ${pendingMigrations.length} pendientes`,
    );
  } catch (error) {
    console.error('❌ Error consultando migraciones:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

// Ejecutar si este archivo se ejecuta directamente
if (require.main === module) {
  showMigrations();
}

export { showMigrations };
