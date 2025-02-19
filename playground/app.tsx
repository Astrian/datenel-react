import React from 'react'
import { WeekPicker } from "../src/index.ts"
import './app.scss'

export default () => {
	return (<div className='app'>
		<div className="border">
			<WeekPicker />
		</div>
	</div>)
}