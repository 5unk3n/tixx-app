import { isAxiosError } from 'axios'
import QrScanner from 'qr-scanner'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'

import TitleHeader from '@/components/layouts/TitleHeader'
import { useValidateEventTicket } from '@/hooks/queries/tickets/useValidateEventTicket'
import { useQRStore } from '@/stores/qrStore'
import { EventTicket, Ticket } from '@/types'

const beepSuccessSound = new Audio('/sounds/beep-success.mp3')
const beepSelectSound = new Audio('/sounds/beep-select.mp3')
const beepErrorSound = new Audio('/sounds/beep-error.mp3')

export default function QRPage() {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { state: event } = useLocation()
	const { currentCameraId, setCurrentCameraId } = useQRStore()

	const videoRef = useRef<HTMLVideoElement>(null)
	const scannerRef = useRef<QrScanner | null>(null)
	const lastScannedRef = useRef<{ value: string; time: number }>({
		value: '',
		time: 0
	})
	const [cameraList, setCameraList] = useState<QrScanner.Camera[]>([])
	const [isScannerReady, setIsScannerReady] = useState(false)

	const { mutateAsync: validateEventTicket } = useValidateEventTicket()

	const handleScan = useCallback(
		async (rawValue: string) => {
			const now = Date.now()
			if (
				lastScannedRef.current.value === rawValue &&
				now - lastScannedRef.current.time < 2000
			) {
				return
			}
			lastScannedRef.current = { value: rawValue, time: now }

			try {
				await validateEventTicket({
					eventId: event.id,
					token: rawValue
				})
				beepSuccessSound.play()
				toast.success(t('qr.entryComplete'), { position: 'top-center' })
			} catch (error) {
				if (isAxiosError(error)) {
					const status = error.response?.status
					const errorData = error.response?.data || {}
					let message = errorData.message
					let eventTickets: (EventTicket & { ticket: Ticket })[] | null = null

					switch (status) {
						case 400:
							message = t('qr.errors.hostAuthMismatch')
							break
						case 404:
							if (message.includes('user with id')) {
								message = t('qr.errors.userNotFound')
							} else if (message.includes('event with id')) {
								message = t('qr.errors.eventNotFound')
							} else if (message.includes('No valid ticket found')) {
								message = t('qr.errors.noValidTicket')
							}
							break
						case 409:
							message = t('qr.errors.selectTicketAgain')
							eventTickets = errorData.eventTickets as (EventTicket & {
								ticket: Ticket
							})[]
							break
						case 410:
							if (message.includes('expired')) {
								message = t('qr.errors.qrExpired')
							} else if (message.includes('Invalid token')) {
								message = t('qr.errors.invalidQr')
							}
							break
						case 500:
							if (message.includes('Token verification')) {
								message = t('qr.errors.tokenVerificationFailed')
							} else {
								message = t('common.serverError')
							}
							break
						default:
							message = t('common.unknownError')
							console.error('Unexpected error:', error)
					}

					if (eventTickets) {
						beepSelectSound.play()
						navigate('/scan/result', {
							state: { message, eventTickets }
						})
					} else {
						beepErrorSound.volume = 0.5
						beepErrorSound.play()
						toast.error(message, { position: 'top-center' })
					}
				}
			}
		},
		[event, navigate, t, validateEventTicket]
	)

	useEffect(() => {
		console.log(event)

		if (event === null) {
			navigate('/')
		}
	}, [event, navigate])

	// 카메라 목록 불러오기 및 기본값 선택
	useEffect(() => {
		QrScanner.listCameras(true).then((cameras) => {
			setCameraList(cameras)

			if (
				currentCameraId &&
				cameras.some((camera) => camera.id === currentCameraId)
			) {
				return
			}

			// 1. wide/main label 우선
			const wide = cameras.find(
				(cam) =>
					cam.label.toLowerCase().includes('wide') ||
					cam.label.toLowerCase().includes('main')
			)
			if (
				wide &&
				(wide.label.toLowerCase().includes('back') ||
					wide.label.toLowerCase().includes('rear') ||
					wide.label.toLowerCase().includes('environment'))
			) {
				setCurrentCameraId(wide.id)
				return
			}
			// 2. label에 back/rear/environment 포함된 첫 번째
			const env = cameras.find(
				(cam) =>
					cam.label.toLowerCase().includes('back') ||
					cam.label.toLowerCase().includes('rear') ||
					cam.label.toLowerCase().includes('environment')
			)
			if (env) {
				setCurrentCameraId(env.id)
				return
			}
			// 3. 아무거나
			if (cameras[0]) setCurrentCameraId(cameras[0].id)
		})
	}, [currentCameraId, setCurrentCameraId])

	// QrScanner 인스턴스 관리
	useEffect(() => {
		if (!videoRef.current) return

		const scanner = new QrScanner(
			videoRef.current,
			(result: unknown) => {
				if (typeof result === 'string') {
					handleScan(result)
				} else if (result && typeof result === 'object' && 'data' in result) {
					handleScan((result as { data: string }).data)
				}
			},
			{
				returnDetailedScanResult: true,
				highlightCodeOutline: true,
				highlightScanRegion: true,
				maxScansPerSecond: 5
			}
		)
		scannerRef.current = scanner

		setIsScannerReady(true)

		return () => {
			scanner.stop()
			scanner.destroy()
			scannerRef.current = null
		}
	}, [handleScan])

	// 카메라 변경
	useEffect(() => {
		const scanner = scannerRef.current
		if (!scanner || !currentCameraId) return

		let isCancelled = false

		scanner
			.setCamera(currentCameraId)
			.then(() => {
				if (!isCancelled) {
					scanner.start()
				}
			})
			.catch((err) => {
				if (!isCancelled) {
					console.error(
						`Failed to set camera to ${currentCameraId}. It might be in use or not available.`,
						err
					)
				}
			})

		return () => {
			isCancelled = true
		}
	}, [currentCameraId, isScannerReady])

	return (
		<div className="relative min-h-svh bg-black">
			<TitleHeader title={event?.name} showBack />
			<video
				ref={videoRef}
				className="w-svh h-svh object-cover"
				playsInline
				muted
			/>
			{/* 카메라 선택 드롭다운 */}
			{cameraList.length > 1 && (
				<select
					value={currentCameraId ?? ''}
					onChange={(e) => setCurrentCameraId(e.target.value)}
					className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2 rounded bg-white/80 px-3 py-2 text-black"
				>
					{cameraList.map((cam) => (
						<option key={cam.id} value={cam.id}>
							{cam.label || `Camera ${cam.id}`}
						</option>
					))}
				</select>
			)}
		</div>
	)
}
