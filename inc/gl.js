class GL {
	constructor(canvas) {
		this.gl = canvas.getContext("webgl2");

		return this.gl;
	}

	createShader(name, type) {
		const { gl } = this;

		
	}
}

export { GL };