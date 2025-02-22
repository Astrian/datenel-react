import { useEffect, useState } from 'react'
import { getCalendarDates, getL10Weekday, generateUniqueId, applyColor } from '../utils'

export interface SingleDatePickerProps {
	/**
	 	* Value of the selected date.
		* 
		* @description Control the selected
		* date programmatically, including situations like provide a default value or control the selected 
		* date by parent component. Use 1-12 for month, instead of 0-11, if you are using object to set the
		* value.
		* 
		* @see {@link https://datenel.js.org/guide/react/components/SingleDatePicker.html#value}
		* 
		* @example { year: 2025, month: 1, day: 1 }
		* @example new Date(2025, 0, 1)
		* @default new Date()
			*/
	value?: Date | { year: number, month: number, day: number }

	/**
	 * Event handler when a date is selected.
	 * @description A callback function that will be called when a date is selected inside the panel.
	 * The returned month and day are 1-12 instead of 0-11.
	 * 
	 * @see {@link https://datenel.js.org/guide/react/components/SingleDatePicker.html#onselect-date-void}
	 * 
	 * @param {{ year: number, month: number, day: number }} - The date user selected.
	 * @example { year: 2025, month: 1, day: 1 } // User selected 1 Jan 2025
	 */
	onSelect?: (date: {
		year: number,
		month: number,
		day: number
	}) => void

	/**
	 * Localization
	 * @description The language code that will be used to localize the panel.
	 * 
	 * Accept standard ISO 639-1 language code, such as 'zh-CN', 'en-US', 'ja-JP', etc. Note 
	 * that it will not effect to the screen reader, but the screen reader will still read the 
	 * date in the user’s language.
	 * 
	 * @see {@link https://datenel.js.org/guide/react/components/SingleDatePicker.html#localization}
	 * @default navigator.language
	 */
	localization?: string

	/**
	 * Event handler when the panel is closed.
	 * @description User requires to close the panel without select a specific date. Note 
	 * that the close button is not visible, but can be read by screen reader. The close 
	 * button for the screen reader is only available when this prop is not `undefined`.
	 * 
	 * @see {@link https://datenel.js.org/guide/react/components/SingleDatePicker.html#onclose-void}
	 * 
	 * @default undefined
	 */
	onClose?: () => void

	/**
	 * Main color of the panel
	 * @description The main color of the panel, including the text color and the border color.
	 * 
	 * @see {@link https://datenel.js.org/guide/react/components/SingleDatePicker.html#maincolor}
	 * 
	 * @default '#000000'
	 */
	mainColor?: string

	/**
	 * Accent color of the panel
	 * @description The accent color of the panel, including the background color of the selected date.
	 * @see {@link https://datenel.js.org/guide/react/components/SingleDatePicker.html#accentcolor}
	 * @default '#000000'
	 */
	accentColor?: string

	/**
	 * Reversed color of the panel
	 * @description The reversed color of the panel, including the text color of the selected date.
	 * @see {@link https://datenel.js.org/guide/react/components/SingleDatePicker.html#reversedcolor}
	 * @default '#ffffff'
	 */
	reversedColor?: string

	/**
	 * Hover color of the panel
	 * @description The hover color of the panel, including the hover background color of the date.
	 * @see {@link https://datenel.js.org/guide/react/components/SingleDatePicker.html#hovercolor}
	 * @default '#00000017'
	 */
	hoverColor?: string

	/**
	 * Border color of the panel
	 * @description The border color of the panel, including the divider color between the header and the body.
	 * @see {@link https://datenel.js.org/guide/react/components/SingleDatePicker.html#bordercolor}
	 * @default '#e0e0e0'
	 */
	borderColor?: string

	/**
	 * Available range of dates
	 * 
	 * @description Limit a range of dates that can be selected. It should be an array of two dates, which the first
	 * one is the available range start date, and the second one is the available range end date. 
	 * 
	 * The parameter will be ignored if the array length is not 2.
	 * 
	 * @see {@link https://datenel.js.org/guide/react/components/SingleDatePicker.html#availablerange}
	 * 
	 * @example [new Date(2025, 0, 1), new Date(2025, 11, 31)]
	 * @example [new Date(2025, 0, 1), null]
	 * @example [null, new Date(2025, 11, 31)]
	 * @example [new Date(2025, 11, 31), new Date(2025, 0, 1)]
	 * @default undefined
	 */
	availableRange?: [(Date | { year: number, month: number, day: number } | null), (Date | { year: number, month: number, day: number } | null)]
}

/**
 * SingleDatePicker
 * @description A panel that allows users to select a date. Check out the online documentation for
 * interactive examples and more details.
 * 
 * @component
 * 
 * @see {@link https://datenel.js.org/guide/react/components/SingleDatePicker.html}
 * 
 * @param {SingleDatePickerProps} props
 */
const SingleDatePicker: React.FC<SingleDatePickerProps> = ({ value, onSelect, localization, onClose, mainColor = '#000000', accentColor = '#000000', reversedColor = '#ffffff', hoverColor = '#00000017', borderColor = '#e0e0e0', availableRange: inputAvailableRange }: SingleDatePickerProps) => {
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [dates, setDates] = useState<Date[]>([])
	const [l10nDays, setL10nDays] = useState<string[]>([])
	const [selectMonth, setSelectMonth] = useState(false)
	const uniqueId = generateUniqueId()
	const [availableRangeStart, setAvailableRangeStart] = useState<Date | null>(null)
	const [availableRangeEnd, setAvailableRangeEnd] = useState<Date | null>(null)

	useEffect(() => {
		setDates(getCalendarDates(currentMonth, currentYear))
	}, [currentMonth, currentYear])

	useEffect(() => {
		if (!value) return
		if (!(value instanceof Date)) {
			if (value.year < 100) value.year = Number(`20${value.year}`)
			if (value.month < 0 || value.month > 11)
				return console.warn('Invalid value: Month should be between 1 and 12.')
			if (value.day < 1 || value.day > 31)
				return console.warn('Invalid value: Day should be between 1 and 31.')
		}
		const date = value instanceof Date ? value : new Date(value.year, value.month - 1, value.day)
		setSelectedDate(date)
		setCurrentMonth(date.getMonth())
		setCurrentYear(date.getFullYear())
	}, [value])

	useEffect(() => {
		const i18n = localization || navigator.language
		setL10nDays(getL10Weekday(i18n))
	}, [localization])

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
		if (!inputAvailableRange) {
			setAvailableRangeEnd(null)
			setAvailableRangeStart(null)
			return
		}
		if (inputAvailableRange.length !== 2) {
			console.warn('Invalid availableRange: The length of the array should be 2. The parameter will be ignored.')
			setAvailableRangeEnd(null)
			setAvailableRangeStart(null)
			return
		}
		const [start, end] = inputAvailableRange
		if (start && end) {
			const inputStart = !(start instanceof Date) ? new Date(start.year, start.month - 1, start.day) : start
			const inputEnd = !(end instanceof Date) ? new Date(end.year, end.month - 1, end.day) : end
			if (inputStart > inputEnd) {
				setAvailableRangeStart(inputEnd)
				setAvailableRangeEnd(inputStart)
			} else {
				setAvailableRangeStart(inputStart)
				setAvailableRangeEnd(inputEnd)
			}
		}
		else if (start && !end) {
			if (!(start instanceof Date)) setAvailableRangeStart(new Date(start.year, start.month - 1, start.day))
			else setAvailableRangeStart(start)
			setAvailableRangeEnd(null)
		}
		else if (!start && end) {
			if (!(end instanceof Date)) setAvailableRangeEnd(new Date(end.year, end.month - 1, end.day))
			else setAvailableRangeEnd(end)
			setAvailableRangeStart(null)
		}
		else {
			setAvailableRangeStart(null)
			setAvailableRangeEnd(null)
		}
	}, [inputAvailableRange])

	function selectDate(date: Date) {
		setSelectedDate(date)
		onSelect?.({
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate()
		})
	}

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

	function changeYear(year: string) {
		if (isNaN(Number(year))) return
		if (Number(year) < 0) return
		setCurrentYear(Number(year))
	}

	function adjustYear() {
		if (currentYear < 100) setCurrentYear(Number(`20${currentYear}`))
	}

	if (selectMonth) return (
		<div className='__datenel_datenel-component' role="dialog" aria-label="Date selection panel, you are now at month and year quick-select" id={`__datenel-${uniqueId}`}>
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
					{Array.from({ length: 12 }).map((_, index) => {
						function calculateNotAvailable() {
							// When the last day of a month not inside the range of available dates
							const lastDayOfMonth = new Date(currentYear, index + 1, 0)
							if (availableRangeStart && lastDayOfMonth < availableRangeStart) return true
							// When the first day of a month not inside the range of available dates
							const firstDayOfMonth = new Date(currentYear, index, 1)
							if (availableRangeEnd && firstDayOfMonth > availableRangeEnd) return true
							return false
						}
						return <button
							className={`__datenel_item ${calculateNotAvailable() && '__datenel_not-available'}`}
							key={index}
							onClick={() => {
								setCurrentMonth(index)
								setSelectMonth(false)
							}}
							aria-label={`Go to ${new Date(currentYear, index).toLocaleString(localization || navigator.language, { month: 'long' })} of the year ${currentYear}`}
							disabled={calculateNotAvailable()}
							aria-hidden={calculateNotAvailable()}
						>
							{new Date(currentYear, index).toLocaleString(localization || navigator.language, { month: 'long' })}
						</button>
					})}
				</div>
			</div>
			{!!onClose && <button className='__datenel_sr-only' onClick={onClose}>Close the panel</button>}
		</div>
	)
	else return (
		<div className='__datenel_datenel-component' role="dialog" aria-label="Date selection panel" id={`__datenel-${uniqueId}`}>
			<div className='__datenel_header'>
				<button className='__datenel_stepper' onClick={skipToLastMonth} aria-label={`Go to last month, ${new Date(currentYear, currentMonth - 1).toLocaleString(localization || navigator.language, { month: 'long' })}`}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path></svg></button>
				<button className='__datenel_indicator' onClick={() => setSelectMonth(true)} aria-label={`You are now at ${new Date(currentYear, currentMonth).toLocaleString(localization || navigator.language, { month: 'long', year: 'numeric' })}. Click here to quick-select month or year.`}>
					{new Date(currentYear, currentMonth).toLocaleString(localization || navigator.language, { month: 'long', year: 'numeric' })}
				</button>
				<button className='__datenel_stepper' onClick={skipToNextMonth} aria-label={`Go to next month, ${new Date(currentYear, currentMonth + 1).toLocaleString(localization || navigator.language, { month: 'long' })}`}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path></svg></button>
			</div>
			<div className='__datenel_body'>
				<div className='__datenel_calendar-view-body __datenel_grid' aria-live="polite">
					{l10nDays.map((day, index) => <div className='__datenel_item __datenel_day-indicator' key={index}>{day}</div>)}

					{dates.map(date => {
						const notAvailable = (availableRangeStart && date < availableRangeStart) || (availableRangeEnd && date > availableRangeEnd) || currentMonth !== date.getMonth()
						return <button
							className={`__datenel_item __datenel_date ${notAvailable && '__datenel_not-available'} ${selectedDate.toDateString() === date.toDateString() && '__datenel_active'}`}
							key={date.toISOString()}
							onClick={() => selectDate(date)}
							aria-label={`${date.toLocaleString(localization || navigator.language, { dateStyle: 'full' })}${date.toDateString() === new Date().toDateString() ? ", this is today" : ""}, click to select this date`}
							tabIndex={currentMonth !== date.getMonth() ? -1 : 0}
							aria-hidden={notAvailable}
							disabled={notAvailable}
						>
							{date.getDate()}
							{date.toDateString() === new Date().toDateString() && <svg xmlns="http://www.w3.org/2000/svg" className='__datenel_today-indicator' viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path></svg>}
						</button>
					})}
				</div>
			</div>
			{!!onClose && <button className='__datenel_sr-only' onClick={onClose}>Close the panel</button>}
		</div>
	)
}

export default SingleDatePicker