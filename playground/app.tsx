import React from 'react'
import { SingleDatePicker, SingleWeekPicker } from "../src"
import './app.scss'

export default () => {

	return (<div className='app'>
		<div className="border">
			<SingleDatePicker availableRange={[{
				year: 2023,
				month: 1,
				day: 1
			}, {
				year: 2023,
				month: 12,
				day: 31
			}]} />
		</div>
	</div>)
}