import { useEffect, useState } from "react"
import { generateUniqueId, applyColor, getL10Weekday, getCalendarDates, calculateWeekNum } from "../utils"

export interface SingleWeekPickerProps {
	/**
 * The language code that will be used to localize the panel.
 * Accept standard ISO 639-1 language code, such as 'zh-CN', 'en-US', 'ja-JP', etc. Note 
 * that it will not effect to the screen reader, but the screen reader will still read the 
 * date in the user’s language.
 * @default navigator.language
 */
	localization?: string

	/**
 * The main color of the panel, including the text color and the border color.
 *@default '#000000'
 */
	mainColor?: string

	/**
	 * The accent color of the panel, including the background color of the selected date.
	 *@default '#000000'
	 */
	accentColor?: string

	/**
	 * The reversed color of the panel, including the text color of the selected date.
	 *@default '#ffffff'
	 */
	reversedColor?: string

	/**
	 * The hover color of the panel, including the hover background color of the date.
	 *@default '#00000017'
	 */
	hoverColor?: string

	/**
	 * The border color of the panel, including the divider color between the header and the body.
	 *@default '#e0e0e0'
	 */
	borderColor?: string
}

/**
 * SingleWeekPicker
 * A panel that allows users to select a week.
 * 
 * @component
 * 
 * @param 
 */
export default ({ localization, mainColor = '#000000', accentColor = '#000000', reversedColor = '#ffffff', hoverColor = '#00000017', borderColor = '#e0e0e0' }: SingleWeekPickerProps) => {
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
	const [selectMonth, setSelectMonth] = useState(false)
	const [calendarWeeks, setCalendarWeeks] = useState<Date[][]>([])
	const [l10nDays, setL10nDays] = useState<string[]>([])
	const uniqueId = generateUniqueId()

	function skipToLastMonth() {
		if (currentMonth === 0) {
			setCurrentMonth(11)
			setCurrentYear(currentYear - 1)
		}
		else setCurrentMonth(currentMonth - 1)
	}

	function skipToNextMonth() {
		if (currentMonth === 11) {
			setCurrentMonth(0)
			setCurrentYear(currentYear + 1)
		}
		else setCurrentMonth(currentMonth + 1)
	}

	useEffect(() => {
		applyColor(uniqueId, {
			mainColor: mainColor,
			accentColor: accentColor,
			reversedColor: reversedColor,
			hoverColor: hoverColor,
			borderColor: borderColor
		})
	}, [mainColor, accentColor, reversedColor, hoverColor, borderColor])

	useEffect(() => {
		const i18n = localization || navigator.language
		setL10nDays(getL10Weekday(i18n))
	}, [localization])

	useEffect(() => {
		const dates = getCalendarDates(currentMonth, currentYear)
		let weeks: Date[][] = []
		for (let i = 0; i < dates.length; i += 7)
			weeks.push(dates.slice(i, i + 7))
		setCalendarWeeks(weeks)
	}, [currentMonth, currentYear])

	useEffect(() => {
		const date = new Date(2033, 0, 1)
		console.log(date)
		console.log(calculateWeekNum(date))
	}, [])

	if (selectMonth) {
		return <div className='datenel-component' role="dialog" aria-label="Week selection panel, you are now at month and year quick-select" id={`__datenel-${uniqueId}`}></div>
	} else {
		return <div className='datenel-component' role="dialog" aria-label="Week selection panel" id={`__datenel-${uniqueId}`}>

			<div className='header'>
				<button className='stepper' onClick={skipToLastMonth} aria-label={`Go to last month, ${new Date(currentYear, currentMonth - 1).toLocaleString(localization || navigator.language, { month: 'long' })}`}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path></svg></button>
				<button className='indicator' onClick={() => setSelectMonth(true)} aria-label={`You are now at ${new Date(currentYear, currentMonth).toLocaleString(localization || navigator.language, { month: 'long', year: 'numeric' })}. Click here to quick-select month or year.`}>
					{new Date(currentYear, currentMonth).toLocaleString(localization || navigator.language, { month: 'long', year: 'numeric' })}
				</button>
				<button className='stepper' onClick={skipToNextMonth} aria-label={`Go to next month, ${new Date(currentYear, currentMonth + 1).toLocaleString(localization || navigator.language, { month: 'long' })}`}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path></svg></button>
			</div>

			<div className='calendar-view-body flex' aria-live="polite">
				<div className="listitem">
					{Array.from({ length: 7 }).map((_, index) => <div className='item day-indicator' key={index}>{l10nDays[index]}</div>)}
				</div>

				{calendarWeeks.map((week, index) => <button className="listitem" key={index} onClick={() => console.log(calculateWeekNum(week[0]))}>
					{week.map(date => <div
						className={`item date ${currentMonth !== date.getMonth() && 'extra-month'}`}
						key={date.getDate()}
					>
						{date.getDate()}
					</div>)}
				</button>)}
			</div>
		</div>
	}
}