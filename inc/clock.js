class Clock {
	constructor() {
		this.dt = 0;
		this.elapsed = 0;

		this._last = performance.now();
	}

	tick() {
		this._last = performance.now();

		this.dt = this._last - this.elapsed;
		this.elapsed = this._last;

		return this.dt;
	}
}

export { Clock };