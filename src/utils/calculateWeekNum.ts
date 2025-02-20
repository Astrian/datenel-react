export default (date: Date): { weekYear: number, weekNum: number } => {
	const tempDate = new Date(date)
	tempDate.setHours(0, 0, 0, 0)

	tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() || 7))

	const firstThursday = new Date(tempDate.getFullYear(), 0, 4)
	firstThursday.setDate(firstThursday.getDate() + 3 - (firstThursday.getDay() || 7))

	const diffInDays = Math.floor((tempDate.getTime() - firstThursday.getTime()) / (24 * 60 * 60 * 1000))

	const weekNum = Math.ceil((diffInDays + 1) / 7)

	return {
		weekYear: weekNum === 53 ? tempDate.getFullYear() + 1 : tempDate.getFullYear(),
		weekNum
	}
}