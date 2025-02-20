import React from 'react'
import { SingleDatePicker, SingleWeekPicker } from "../src/index"
import './app.scss'

export default () => {

	return (<div className='app'>
		<div className="border">
			<div>
				<SingleWeekPicker />
			</div>
			<div>
				<SingleDatePicker />
			</div>
		</div>
	</div>)
}