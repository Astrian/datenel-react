import React from 'react'
import { SingleDatePicker } from "../src/index"
import './app.scss'

export default () => {

	function onSelect(value) {
		alert(`You select ${value.year}-${value.month}-${value.day}`)
	}

	return (<div className='app'>

		<div className="border">
			<SingleDatePicker 
				value={{
					year: 2025,
					month: 1,
					day: 1
				}}
				onSelect={onSelect}
				localization="zh-CN"
				onClose={() => alert('close')}
			/>
		</div>
	</div>)
}