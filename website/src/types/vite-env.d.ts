/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_DEV_URL: string
	readonly VITE_PROD_URL: string
	readonly VITE_KAKAO_REST_API_KEY: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
