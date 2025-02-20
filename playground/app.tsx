import React from 'react'
import { SingleDatePicker, SingleWeekPicker } from "../src/index"
import './app.scss'

export default () => {

	function onSelect(value) {
		alert(`You select ${value.year}-${value.month}-${value.day}`)
	}

	return (<div className='app'>
		<div className="border">
			<div>
				<SingleWeekPicker />
			</div>
		</div>
	</div>)
}