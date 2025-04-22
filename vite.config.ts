import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

const isHttps = process.env.VITE_HTTPS === 'true';
const sslKeyPath = process.env.VITE_SSL_KEY_PATH || './ssl/localhost-key.pem';
const sslCertPath = process.env.VITE_SSL_CERT_PATH || './ssl/localhost.pem';

export default defineConfig({
	plugins: [
		paraglideVitePlugin({ project: './project.inlang', outdir: './src/paraglide' }),
		sveltekit()
	],
	mode: 'production',
	test: {
		workspace: [
			{
				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',

				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	},
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib')
		}
	},
	server: {
		https: isHttps
			? {
					key: fs.readFileSync(path.resolve(__dirname, sslKeyPath)),
					cert: fs.readFileSync(path.resolve(__dirname, sslCertPath))
				}
			: undefined,
		proxy: {
			'/api': {
				target: 'http://localhost:8888',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
});
