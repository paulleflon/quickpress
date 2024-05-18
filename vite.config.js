import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('package.json'));

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		PKG: pkg
	}
});
