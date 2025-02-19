import LeftArrowIcon from '@/assets/icons/left-arrow.svg'
import RightArrowIcon from '@/assets/icons/right-arrow.svg'
import { useEffect, useState } from 'react'
import { getCalendarDates, getL10Weekday } from '../utils'

interface Props {
	value?: Date | { year: number, month: number, day: number }
	onSelect?: (date: {
		year: number,
		month: number,
		day: number
	}) => void
	localization?: string
}

/**
 * A panel that allows users to select a date.
 * 
 * @component
 * 
 * @param {Object} props
 * @param {Date | { year: number, month: number, day: number }} props.value - Control the selected
 * date programmatically, including situations like provide a default value or control the selected 
 * date by parent component.
 * @param {(date: { year: number, month: number, day: number }) => void} props.onSelect - A callback
 * function that will be called when a date is selected inside the panel.
 * @param {string} props.localization - The language code that will be used to localize the panel.
 * Accept standard ISO 639-1 language code, such as 'zh-CN', 'en-US', 'ja-JP', etc. Default to the
 * language of the user’s browser.
 */
export default ({ value, onSelect, localization }: Props) => {
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [dates, setDates] = useState<Date[]>([])
	const [l10nDays, setL10nDays] = useState<string[]>([])
	const [selectMonth, setSelectMonth] = useState(true)

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

	if (selectMonth) return (<div className='datenel-component'>
		<div className='header'>
			<button className='stepper' onClick={() => {
				if (currentYear === 0) return
				setCurrentYear(currentYear - 1)
			}}><img src={LeftArrowIcon} /></button>
			<input className='indicator' 
				value={currentYear}
				onChange={e => setCurrentYear(parseInt(e.target.value))}
			/>
			<button className='stepper' onClick={() => {
				if (currentYear === 9999) return
				setCurrentYear(currentYear + 1)
			}}><img src={RightArrowIcon} /></button>
		</div>
		<div className='month-selector-body'>
			{Array.from({ length: 12 }).map((_, index) => <button className={`item`} key={index} onClick={() => {
				setCurrentMonth(index)
				setSelectMonth(false)
			}}>
				{new Date(currentYear, index).toLocaleString(localization || navigator.language, { month: 'long' })}
			</button>)}
		</div>
	</div>)
	else return (<div className='datenel-component'>
		<div className='header'>
			<button className='stepper' onClick={skipToLastMonth}><img src={LeftArrowIcon} /></button>
			<button className='indicator' onClick={() => setSelectMonth(true)}>
				{new Date(currentYear, currentMonth).toLocaleString(localization || navigator.language, { month: 'long', year: 'numeric' })}
			</button>
			<button className='stepper' onClick={skipToNextMonth}><img src={RightArrowIcon} /></button>
		</div>
		<div className='calendar-view-body'>
			{l10nDays.map((day, index) => <div className='item day-indicator' key={index}>{day}</div>)}

			{dates.map(date => <button className={`item date ${currentMonth !== date.getMonth() && 'extra-month'} ${selectedDate.toDateString() === date.toDateString() && 'active'}`} key={date.toISOString()} onClick={() => selectDate(date)}>
				{date.getDate()}
				{date.toDateString() === new Date().toDateString() && <svg xmlns="http://www.w3.org/2000/svg" className='today-indicator' viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path></svg>}
			</button>)}
		</div>
	</div>)
}