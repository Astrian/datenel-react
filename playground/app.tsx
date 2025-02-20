import React from 'react'
import { SingleDatePicker, SingleWeekPicker } from "../src"
import './app.scss'

export default () => {

	return (<div className='app'>
		<div className="border">
			<SingleWeekPicker value={new Date(2025, 0, 1)} onSelect={(date) => console.log(date)} />
		</div>
	</div>)
}