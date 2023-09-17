import { sveltekit } from '@sveltejs/kit/vite';
import WindiCSS from 'vite-plugin-windicss'

const config = {
	plugins: [sveltekit(), WindiCSS()]
};

export default config;
