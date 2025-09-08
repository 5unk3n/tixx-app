module.exports = {
	withStallion: (Component) => Component,
	useStallionUpdate: () => ({
		newReleaseBundle: null,
		useStallionUpdate: () => ({ currentlyRunningBundle: { version: '1' } })
	}),
	restart: jest.fn()
}
