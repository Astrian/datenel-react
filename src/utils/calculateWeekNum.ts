export default (date: Date): { weekYear: number, weekNum: number } => {
	const tempDate = new Date(date)
	tempDate.setHours(0, 0, 0, 0)

	tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() || 7))

	const firstFriday = new Date(tempDate.getFullYear(), 0, 5) // Changed to 5 for Friday
	firstFriday.setDate(firstFriday.getDate() + 3 - (firstFriday.getDay() || 7))

	const diffInDays = Math.floor((tempDate.getTime() - firstFriday.getTime()) / (24 * 60 * 60 * 1000))

	const weekNum = Math.ceil((diffInDays + 1) / 7)

	return {
		weekYear: tempDate.getFullYear(),
		weekNum
	}
}