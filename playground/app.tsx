import React from 'react'
import { WeekPicker } from "../src/index.ts"
import './app.scss'

export default () => {


	return (<div className='app'>
		<div className="border">
			<WeekPicker value={{
				year: 2025,
				month: 1,
				day: 1
			}} />
		</div>
	</div>)
}