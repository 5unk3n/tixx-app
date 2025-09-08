export default function ComingSoon() {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '80vh',
				textAlign: 'center',
				fontSize: '2rem',
				color: '#555',
				backgroundColor: '#f9f9f9',
				borderRadius: '8px',
				padding: '20px',
				boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
			}}
		>
			<h1>Coming Soon!</h1>
			<p style={{ fontSize: '1rem', color: '#777' }}>Under construction.</p>
		</div>
	)
}
