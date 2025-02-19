import React from 'react'
import { WeekPicker } from "../src/index.ts"
import './app.scss'

export default () => {

	function onSelect(value) {
		alert(`You select ${value.year}-${value.month}-${value.day}`)
	}

	return (<div className='app'>

		<div className="border">
			<WeekPicker 
				value={{
					year: 2025,
					month: 1,
					day: 1
				}}
				onSelect={onSelect}
				localization="zh-CN"
				closable
			/>
		</div>
	</div>)
}