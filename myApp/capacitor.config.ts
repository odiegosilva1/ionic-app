import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.petshop.app',
  appName: 'PetShop',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SQLite: {
      androidDatabaseLocation: 'default',
    },
  },
};

export default config;
