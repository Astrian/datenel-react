import React from 'react'
import { SingleDatePicker, SingleWeekPicker } from "../src"
import './app.scss'

export default () => {

	return (<div className='app'>
		<div className="border">
			<SingleDatePicker />
		</div>
	</div>)
}