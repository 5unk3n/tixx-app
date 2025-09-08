import { useState } from 'react'
import { useStallionModal } from 'react-native-stallion'

export const useDeveloperMode = () => {
	const [tapCount, setTapCount] = useState(0)
	const [lastTapTime, setLastTapTime] = useState(0)
	const [hasLongPressed, setHasLongPressed] = useState(false)
	const [isDevModeUnlocked, setIsDevModeUnlocked] = useState(false)
	const { showModal } = useStallionModal()

	const handlePress = () => {
		const currentTime = Date.now()

		if (currentTime - lastTapTime > 2000) {
			setTapCount(1)
			setLastTapTime(currentTime)
			return
		}

		const newTapCount = tapCount + 1
		setTapCount(newTapCount)
		setLastTapTime(currentTime)

		if (newTapCount >= 10 && hasLongPressed) {
			setIsDevModeUnlocked(true)
			setTapCount(0)
			setHasLongPressed(false)
			showModal()
		}
	}

	const handleLongPress = () => {
		if (tapCount === 5) {
			setHasLongPressed(true)
		} else {
			setTapCount(0)
			setHasLongPressed(false)
		}
	}

	const resetDeveloperMode = () => {
		setTapCount(0)
		setHasLongPressed(false)
		setIsDevModeUnlocked(false)
	}

	return {
		handlePress,
		handleLongPress,
		resetDeveloperMode,
		isDevModeUnlocked,
		tapCount,
		hasLongPressed
	}
}
