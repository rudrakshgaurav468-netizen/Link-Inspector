import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err: any, req: any, res: any) => {
            if (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET') {
              console.warn(
                `\n⚠️  [Vite Proxy] Backend unreachable at http://127.0.0.1:3001${req.url || ''}\n` +
                `👉 Backend not running — did you mean to run 'npm run start' instead of 'npm run dev'?\n`
              );
              if (res && typeof res.writeHead === 'function' && !res.headersSent) {
                res.writeHead(503, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({
                    error: 'Backend Offline',
                    message: 'Backend server on port 3001 is not running (ECONNREFUSED).',
                    hint: "Run 'npm run start' to start both frontend and backend concurrently."
                  })
                );
              }
            } else {
              console.error('[Vite Proxy Error]:', err);
            }
          });
        }
      }
    }
  }
});

