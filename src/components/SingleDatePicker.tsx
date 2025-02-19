import LeftArrowIcon from '@/assets/icons/left-arrow.svg'
import RightArrowIcon from '@/assets/icons/right-arrow.svg'
import { useEffect, useState } from 'react'
import { getCalendarDates, getL10Weekday } from '../utils'

export default () => {
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [dates, setDates] = useState<Date[]>([])
	const [l10nDays, setL10nDays] = useState<string[]>(getL10Weekday())

	useEffect(() => {
		setDates(getCalendarDates(currentMonth, currentYear))
	}, [currentMonth, currentYear])

	useEffect(() => {
		setCurrentMonth(selectedDate.getMonth())
		setCurrentYear(selectedDate.getFullYear())
	}, [selectedDate])

	return (<div className='datenel-component'>
		<div className='header'>
			<button><img src={LeftArrowIcon} /></button>
			<button>month</button>
			<button><img src={RightArrowIcon} /></button>
		</div>
		<div className='body'>
			
			{l10nDays.map(day => <div className='item day-indicator' key={day}>{day}</div>)}

			{dates.map(date => <button className={`item date ${selectedDate.getMonth() !== date.getMonth() ? 'extra-month' : ''}`} key={date.toString()}>
				{date.getDate()}
			</button>)}
		</div>
	</div>)
}