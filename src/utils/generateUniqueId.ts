export default (): string => {
	return Math.random().toString(36).split('.')[1]
}