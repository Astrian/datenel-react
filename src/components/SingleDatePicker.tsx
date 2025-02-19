import LeftArrowIcon from '@/assets/icons/left-arrow.svg'
import RightArrowIcon from '@/assets/icons/right-arrow.svg'
import { useEffect, useState } from 'react'
import { getCalendarDates, getL10Weekday } from '../utils'

interface Props {
	value?: Date | { year: number, month: number, day: number }
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
 */
export default ({ value }: Props) => {
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [dates, setDates] = useState<Date[]>([])
	const userLang = navigator.language
	const l10nDays = getL10Weekday(userLang)

	useEffect(() => {
		setDates(getCalendarDates(currentMonth, currentYear))
	}, [currentMonth, currentYear])

	useEffect(() => {
		if (!value) return
		const date = value instanceof Date ? value : new Date(value.year, value.month - 1, value.day)
		console.log(date)
		setSelectedDate(date)
		setCurrentMonth(date.getMonth())
		setCurrentYear(date.getFullYear())
	}, [value])

	function selectDate(date: Date) {
		setSelectedDate(date)
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

	return (<div className='datenel-component'>
		<div className='header'>
			<button className='month-stepper' onClick={skipToLastMonth}><img src={LeftArrowIcon} /></button>
			<button className='month-indicator'>
				{new Date(currentYear, currentMonth).toLocaleString(userLang, { month: 'long', year: 'numeric' })}
			</button>
			<button className='month-stepper' onClick={skipToNextMonth}><img src={RightArrowIcon} /></button>
		</div>
		<div className='body'>
			
			{l10nDays.map((day, index) => <div className='item day-indicator' key={index}>{day}</div>)}

			{dates.map(date => <button className={`item date ${currentMonth !== date.getMonth() && 'extra-month'} ${selectedDate.toDateString() === date.toDateString() && 'active'}`} key={date.toISOString()} onClick={() => selectDate(date)}>
				{date.getDate()}
				{date.toDateString() === new Date().toDateString() && <svg xmlns="http://www.w3.org/2000/svg" className='today-indicator' viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path></svg>}
			</button>)}
		</div>
	</div>)
}