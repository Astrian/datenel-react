export default (currentDate: number, currentYear: number): Date[] => {
	const baselineDate = new Date(currentYear, currentDate)

	const calendarStart = new Date(baselineDate.getFullYear(), baselineDate.getMonth(), 1)
	if (calendarStart.getDay() !== 1) 
		calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay() + 1)
	
	const calendarEnd = new Date(baselineDate.getFullYear(), baselineDate.getMonth() + 1, 0)
	if (calendarEnd.getDay() !== 0)
		calendarEnd.setDate(calendarEnd.getDate() + 7 - calendarEnd.getDay())
	
	const newDates = []
	for (let i = calendarStart; i <= calendarEnd; i.setDate(i.getDate() + 1))
		newDates.push(new Date(i))
	return newDates
}