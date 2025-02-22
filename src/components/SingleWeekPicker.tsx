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

	/**
	 * A callback function that will be called when a week is selected inside the panel. Note that
	 * Datenel will follow the ISO 8601 standard to calculate the week number, which means that the first
	 * week of the year is the week with the first Friday in it (week started from Monday).
	 * @param {{ year: number, month: number, day: number }} - The date user selected.
	 * @example { year: 2025, month: 1, day: 1 } // User selected 1 Jan 2025
	 */
	onSelect?: (date: {
		weekYear: number,
		weekNum: number
	}) => void

	/**
	 * User requires to close the panel without select a specific date. Note that the close button is not 
	 * visible, but can be read by screen reader. The close button for the screen reader is only available
	 * when this prop is not `undefined`.
	 * @default undefined
	 */
	onClose?: () => void

	/**
		* Control the selected
		* date programmatically, including situations like provide a default value or control the selected 
		* date by parent component. When using the Date object, the week number related to the date will be
		* applied to the panel.
		* @example { weekYear: 2025, weekNum: 1 }
		* @example new Date(2025, 0, 1)
		* @default new Date()
		*/
		value?: { weekYear: number, weekNum: number } | Date
}

/**
 * SingleWeekPicker
 * A panel that allows users to select a week.
 * 
 * @component
 * 
 * @param 
 */
export default ({ localization, mainColor = '#000000', accentColor = '#000000', reversedColor = '#ffffff', hoverColor = '#00000017', borderColor = '#e0e0e0', onClose, onSelect, value }: SingleWeekPickerProps) => {
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
	const [selectedWeek, setSelectedWeek] = useState<{ weekYear: number, weekNum: number }>(calculateWeekNum(new Date()))
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
		if (!value) return
		if (!(value instanceof Date)) {
			if (value.weekYear < 100) value.weekYear = Number(`20${value.weekYear}`)
			if (value.weekNum < 1 || value.weekNum > 53)
				return console.warn('Invalid value: Week number should be between 1 and 53.')
		}
		const date = value instanceof Date ? value : new Date(value.weekYear, 0, 1)
		if ('weekNum' in value)
			date.setDate(date.getDate() + (value.weekNum - 1) * 7)
		setSelectedWeek(calculateWeekNum(date))
		setCurrentMonth(date.getMonth())
		setCurrentYear(date.getFullYear())
	}, [value])

	function selectWeek(date: Date) {
		setSelectedWeek(calculateWeekNum(date))
		onSelect?.(calculateWeekNum(date))
	}

	function changeYear(year: string) {
		if (isNaN(Number(year))) return
		if (Number(year) < 0) return
		setCurrentYear(Number(year))
	}

	function adjustYear() {
		if (currentYear < 100) setCurrentYear(Number(`20${currentYear}`))
	}

	if (selectMonth) {
		return <div className='__datenel_datenel-component' role="dialog" aria-label="Week selection panel, you are now at month and year quick-select" id={`__datenel-${uniqueId}`}>
			<div className='__datenel_header'>
				<button className='__datenel_stepper' onClick={() => {
					if (currentYear <= 100) return
					setCurrentYear(currentYear - 1)
				}} aria-label={`Go to last year, ${currentYear - 1}, you are now at year ${currentYear}`}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path></svg></button>
				<input className='__datenel_indicator'
					value={currentYear}
					onChange={e => changeYear(e.target.value)}
					onBlur={adjustYear}
					aria-label="Year input, type a year to go to that year"
				/>
				<button className='__datenel_stepper' onClick={() => {
					setCurrentYear(currentYear + 1)
				}} aria-label={`Go to next year, ${currentYear + 1}, you are now at year ${currentYear}`}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path></svg></button>
			</div>
			<div className='__datenel_body'>
				<div className='__datenel_month-selector-body'>
					{Array.from({ length: 12 }).map((_, index) => <button className={`__datenel_item`} key={index} onClick={() => {
						setCurrentMonth(index)
						setSelectMonth(false)
					}} aria-label={`Go to ${new Date(currentYear, index).toLocaleString(localization || navigator.language, { month: 'long' })} of the year ${currentYear}`}>
						{new Date(currentYear, index).toLocaleString(localization || navigator.language, { month: 'long' })}
					</button>)}
				</div>
			</div>
			{!!onClose && <button className='__datenel_sr-only' onClick={onClose}>Close the panel</button>}
		</div>
	} else {
		return <div className='__datenel_datenel-component' role="dialog" aria-label="Week selection panel" id={`__datenel-${uniqueId}`}>

			<div className='__datenel_header'>
				<button className='__datenel_stepper' onClick={skipToLastMonth} aria-label={`Go to last month, ${new Date(currentYear, currentMonth - 1).toLocaleString(localization || navigator.language, { month: 'long' })}`}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path></svg></button>
				<button className='__datenel_indicator' onClick={() => setSelectMonth(true)} aria-label={`You are now at ${new Date(currentYear, currentMonth).toLocaleString(localization || navigator.language, { month: 'long', year: 'numeric' })}. Click here to quick-select month or year.`}>
					{new Date(currentYear, currentMonth).toLocaleString(localization || navigator.language, { month: 'long', year: 'numeric' })}
				</button>
				<button className='__datenel_stepper' onClick={skipToNextMonth} aria-label={`Go to next month, ${new Date(currentYear, currentMonth + 1).toLocaleString(localization || navigator.language, { month: 'long' })}`}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path></svg></button>
			</div>

			<div className="__datenel_body">
				<div className="__datenel_week-indicator">
					<div className="__datenel_item __datenel_title">Wk</div>

					{calendarWeeks.map(week => <div className={`__datenel_item ${selectedWeek.weekNum === calculateWeekNum(week[0]).weekNum && selectedWeek.weekYear === calculateWeekNum(week[0]).weekYear ? '__datenel_active' : ''}`} key={calculateWeekNum(week[0]).weekNum} onClick={() => selectWeek(week[0])}>
						{calculateWeekNum(week[0]).weekNum}
					</div>)}

				</div>

				<div className='__datenel_calendar-view-body __datenel_flex' aria-live="polite">
					<div className="__datenel_listitem">
						{Array.from({ length: 7 }).map((_, index) => <div className='__datenel_item __datenel_day-indicator' key={index}>{l10nDays[index]}</div>)}
					</div>

					{calendarWeeks.map((week, index) => {
						const isSelected = selectedWeek.weekYear === calculateWeekNum(week[0]).weekYear && selectedWeek.weekNum === calculateWeekNum(week[0]).weekNum
						return <button className={`__datenel_listitem ${isSelected ? '__datenel_active' : ''}`} key={index} onClick={() => selectWeek(week[0])} aria-label={`Select week ${calculateWeekNum(week[0]).weekNum} of the year ${calculateWeekNum(week[0]).weekYear}, from ${week[0].toLocaleString(localization || navigator.language, { dateStyle: "full" })} to ${week[6].toLocaleString(localization || navigator.language, { weekday: 'long' })}, ${week[6].toLocaleString(localization || navigator.language, { month: 'long' })} ${week[6].getDate()}, ${week[6].getFullYear()}`}>
							{week.map(date => <div
								className={`__datenel_item __datenel_date ${currentMonth !== date.getMonth() && '__datenel_extra-month'}`}
								key={date.getDate()}
							>
								{date.getDate()}
								{date.toDateString() === new Date().toDateString() && <svg xmlns="http://www.w3.org/2000/svg" className='__datenel_today-indicator' viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path></svg>}
							</div>)}
						</button>
					})}
				</div>
			</div>

			{!!onClose && <button className='__datenel_sr-only' onClick={onClose}>Close the panel</button>}
		</div>
	}
}