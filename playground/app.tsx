import React from 'react'
import { SingleDatePicker, SingleWeekPicker } from "../src/index"
import './app.scss'

export default () => {

	function onSelect(value) {
		alert(`You select ${value.weekYear} - ${value.weekNum}`)
	}

	return (<div className='app'>
		<div className="border">
			<div>
				<SingleWeekPicker onSelect={onSelect} />
			</div>
		</div>
	</div>)
}