import React from 'react'
import { SingleDatePicker, SingleWeekPicker } from "../src"
import './app.scss'

export default () => {

	return (<div className='app'>
		<div className="border">
			<SingleDatePicker availableRange={[{
				year: 2025,
				month: 1,
				day: 15
			}, {
				year: 2025,
				month: 11,
				day: 15
			}]} />
		</div>
	</div>)
}