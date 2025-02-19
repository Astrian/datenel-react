import LeftArrowIcon from '@/assets/icons/left-arrow.svg'
import RightArrowIcon from '@/assets/icons/right-arrow.svg'
import { useEffect, useState } from 'react'
import { getCalendarDates, getL10Weekday } from '../utils'

interface Props {
	/**
	 	* Control the selected
		* date programmatically, including situations like provide a default value or control the selected 
		* date by parent component.
		* @default new Date()
	 	*/
	value?: Date | { year: number, month: number, day: number }

	/**
	 * A callback function that will be called when a date is selected inside the panel.
	 * @param date - The date user selected.
	 * @returns 
	 */
	onSelect?: (date: {
		year: number,
		month: number,
		day: number
	}) => void

	/**
	 * The language code that will be used to localize the panel.
	 * Accept standard ISO 639-1 language code, such as 'zh-CN', 'en-US', 'ja-JP', etc. Note 
	 * that it will not effect to the screen reader, but the screen reader will still read the 
	 * date in the user’s language.
	 * @default navigator.language
	 */
	localization?: string

	/**
	 * User requires to close the panel without select a specific date. Note that the close button is not 
	 * visible, but can be read by screen reader.
	 */
	onClose?: () => void

	/**
	 * Show a close button to the users with screen reader.
	 * @default false
	 */
	closable?: boolean
}

/**
 * A panel that allows users to select a date.
 * 
 * @component
 * 
 * @param {Props} props
 */
export default ({ value, onSelect, localization, onClose, closable = false }: Props) => {
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [dates, setDates] = useState<Date[]>([])
	const [l10nDays, setL10nDays] = useState<string[]>([])
	const [selectMonth, setSelectMonth] = useState(false)

	useEffect(() => {
		setDates(getCalendarDates(currentMonth, currentYear))
	}, [currentMonth, currentYear])

	useEffect(() => {
		if (!value) return
		const date = value instanceof Date ? value : new Date(value.year, value.month - 1, value.day)
		setSelectedDate(date)
		setCurrentMonth(date.getMonth())
		setCurrentYear(date.getFullYear())
	}, [value])

	useEffect(() => {
		const i18n = localization || navigator.language
		setL10nDays(getL10Weekday(i18n))
	}, [localization])

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

	if (selectMonth) return (
		<div className='datenel-component' role="dialog" aria-label="Date selection panel, you are now at month and year quick-select">
			<div className='header'>
				<button className='stepper' onClick={() => {
					if (currentYear === 0) return
					setCurrentYear(currentYear - 1)
				}} aria-label={`Go to last year, ${currentYear - 1}, you are now at year ${currentYear}`}><img src={LeftArrowIcon} /></button>
				<input className='indicator'
					value={currentYear}
					onChange={e => setCurrentYear(parseInt(e.target.value))}
					aria-label="Year input, type a year to go to that year"
				/>
				<button className='stepper' onClick={() => {
					if (currentYear === 9999) return
					setCurrentYear(currentYear + 1)
				}} aria-label={`Go to next year, ${currentYear + 1}, you are now at year ${currentYear}`}><img src={RightArrowIcon} /></button>
			</div>
			<div className='month-selector-body'>
				{Array.from({ length: 12 }).map((_, index) => <button className={`item`} key={index} onClick={() => {
					setCurrentMonth(index)
					setSelectMonth(false)
				}} aria-label={`Go to ${new Date(currentYear, index).toLocaleString(localization || navigator.language, { month: 'long' })} of the year ${currentYear}`}>
					{new Date(currentYear, index).toLocaleString(localization || navigator.language, { month: 'long' })}
				</button>)}
			</div>
			{ closable && <button className='sr-only' onClick={onClose}>Close the panel</button> }
		</div>
	)
	else return (
		<div className='datenel-component' role="dialog" aria-label="Date selection panel">
			<div className='header'>
				<button className='stepper' onClick={skipToLastMonth} aria-label={`Go to last month, ${new Date(currentYear, currentMonth - 1).toLocaleString(localization || navigator.language, { month: 'long' })}`}><img src={LeftArrowIcon} /></button>
				<button className='indicator' onClick={() => setSelectMonth(true)} aria-label={`You are now at ${new Date(currentYear, currentMonth).toLocaleString(localization || navigator.language, { month: 'long', year: 'numeric' })}. Click here to quick-select month or year.`}>
					{new Date(currentYear, currentMonth).toLocaleString(localization || navigator.language, { month: 'long', year: 'numeric' })}
				</button>
				<button className='stepper' onClick={skipToNextMonth} aria-label={`Go to next month, ${new Date(currentYear, currentMonth + 1).toLocaleString(localization || navigator.language, { month: 'long' })}`}><img src={RightArrowIcon} /></button>
			</div>
			<div className='calendar-view-body' aria-live="polite">
				{l10nDays.map((day, index) => <div className='item day-indicator' key={index}>{day}</div>)}

				{dates.map(date => <button
					className={`item date ${currentMonth !== date.getMonth() && 'extra-month'} ${selectedDate.toDateString() === date.toDateString() && 'active'}`}
					key={date.toISOString()}
					onClick={() => selectDate(date)}
					aria-label={`${date.toLocaleString(localization || navigator.language, { dateStyle: 'full' })}${date.toDateString() === new Date().toDateString() ? ", this is today" : ""}, click to select this date`}
					tabIndex={currentMonth !== date.getMonth() ? -1 : 0}
					aria-hidden={currentMonth !== date.getMonth()}
				>
					{date.getDate()}
					{date.toDateString() === new Date().toDateString() && <svg xmlns="http://www.w3.org/2000/svg" className='today-indicator' viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path></svg>}
				</button>)}
			</div>
			{ closable && <button className='sr-only' aria-hidden onClick={onClose}>Close the panel</button> }
		</div>
	)
}