export default (userLang: string) => {
	const newL10nDays = []
	for (let i = 0; i < 7; i++) {
		const date = new Date(2021, 0, i + 4)
		newL10nDays.push(date.toLocaleDateString(userLang, {weekday: "narrow"}))
	}
	return newL10nDays
}