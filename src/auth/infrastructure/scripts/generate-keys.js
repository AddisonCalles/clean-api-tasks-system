const NodeRSA = require('node-rsa');
const fs = require('fs');

// Generar clave RSA
const key = new NodeRSA({ b: 2048 });

// Obtener claves en formato PEM
const privateKey = key.exportKey('pkcs8-private-pem');
const publicKey = key.exportKey('pkcs8-public-pem');

// Crear directorio si no existe
const keysDir = 'src/auth/infrastructure/keys';
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir, { recursive: true });
}

// Guardar archivos
fs.writeFileSync('src/auth/infrastructure/keys/private.key', privateKey);
fs.writeFileSync('src/auth/infrastructure/keys/public.key', publicKey);

console.log('✅ Claves generadas con node-rsa');
