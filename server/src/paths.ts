import path from 'node:path';

/**
 * Resolves the `server/` package root directory containing `public/`.
 * Uses `BENCH_SERVER_ROOT` when set (required when this code is bundled into a
 * CJS host like Electron's main process, where `import.meta.dirname` is unavailable),
 * otherwise falls back to a path relative to this source file for standalone execution.
 */
export function getServerRoot(): string {
  return process.env.BENCH_SERVER_ROOT ?? path.resolve(import.meta.dirname, '..');
}
