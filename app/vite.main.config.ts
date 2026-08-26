import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const serverEntry = path.resolve(appRoot, '../packages/server/src/server.ts');

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      '@kquiz/server': serverEntry,
    },
  },
  build: {
    rollupOptions: {
      external: ['express', 'ws', 'uuid'],
    },
  },
});
