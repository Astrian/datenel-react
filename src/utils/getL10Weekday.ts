export default () => {
	const newL10nDays = []
	for (let i = 0; i < 7; i++) {
		const date = new Date(2021, 0, i + 4)
		newL10nDays.push(date.toLocaleDateString(undefined, {weekday: 'short'}))
	}
	return newL10nDays
}