[Element.prototype]
	.filter(item => !item.hasOwnProperty('remove'))
	.forEach(item =>
		Object.defineProperty(item, 'remove', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: () => this.parentNode.removeChild(this)
		})
	);
