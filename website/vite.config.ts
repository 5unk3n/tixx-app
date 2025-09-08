import path from 'path'

import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')

	return {
		plugins: [react(), svgr(), basicSsl()],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src')
			}
		},
		// 개발환경에서 카메라 사용을 위해 https 필요
		server: {
			proxy: {
				'/api': {
					target: env.VITE_DEV_URL, // 백엔드 URL
					changeOrigin: true, // 호스트 헤더 변경
					secure: false, // HTTP 백엔드라 검증 비활성화
					rewrite: (path) => path.replace(/^\/api/, '') // '/api'를 제거하고 백엔드로 전달
				}
			}
		}
	}
})
