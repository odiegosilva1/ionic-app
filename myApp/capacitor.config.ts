import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.petshop.app',
  appName: 'PetShop',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    cleartext: false,
    allowNavigation: ['localhost', '127.0.0.1', '10.0.2.2'],
  },
  plugins: {
    SQLite: {
      androidDatabaseLocation: 'default',
    },
  },
};

export default config;
