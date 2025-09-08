/**
 * 주어진 URL에서 파일을 fetch하여 File 객체로 반환합니다.
 * 실패 시 undefined를 반환합니다.
 */
export async function fetchFileAsBlob(
	url: string,
	mimeType: string,
	fileName: string
): Promise<File | undefined> {
	try {
		const response = await fetch(url)
		if (!response.ok)
			throw new Error(
				`파일을 가져오지 못했습니다. 상태 코드: ${response.status}`
			)

		const blob = await response.blob()
		return new File([blob], fileName, { type: mimeType })
	} catch (error) {
		console.error('Failed to fetch file as blob:', error)
		return undefined
	}
}
