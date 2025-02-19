export default (id: string, colorValues: {
	mainColor: string
	accentColor: string
	reversedColor: string
	hoverColor: string
	borderColor: string
} = {
	mainColor: '#000000',
	accentColor: '#000000',
	reversedColor: '#ffffff',
	hoverColor: '#00000017',
	borderColor: '#e0e0e0'
}) => {
	const element = document.querySelector(`#__datenel-${id}`) as HTMLDivElement
	if (!element) return
	element.style.setProperty(`--datenel-main-color`, colorValues.mainColor)
	element.style.setProperty(`--datenel-accent-color`, colorValues.accentColor)
	element.style.setProperty(`--datenel-reversed-color`, colorValues.reversedColor)
	element.style.setProperty(`--datenel-hover-color`, colorValues.hoverColor)
	element.style.setProperty(`--datenel-border-color`, colorValues.borderColor)
}