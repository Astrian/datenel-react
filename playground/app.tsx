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
				onClose={() => alert('close')}
				mainColor='#424c50'
				accentColor='#424c50'
				reversedColor='#e9f1f6'
				hoverColor='#e9e7ef44'
				borderColor='#758a9944'
			/>
		</div>
	</div>)
}