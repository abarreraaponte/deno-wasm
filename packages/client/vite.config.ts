import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  	plugins: [react()],
	build: {
		outDir: '../../dist/client'
	},
	envDir: path.resolve(__dirname, '../..'),
})
