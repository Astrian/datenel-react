export default (date: Date): { weekYear: number, weekNum: number } => {
	const tempDate = new Date(date)
	tempDate.setHours(0, 0, 0, 0)

	tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7))

	const forthDay = new Date(tempDate.getFullYear(), 0, 4)
	console.log(forthDay)
	forthDay.setDate(forthDay.getDate() + 4 - (forthDay.getDay() || 7))

	const diffInDays = Math.floor((tempDate.getTime() - forthDay.getTime()) / (24 * 60 * 60 * 1000))

	const weekNum = Math.ceil((diffInDays + 1) / 7)

	return {
		weekYear: tempDate.getFullYear(),
		weekNum
	}
}