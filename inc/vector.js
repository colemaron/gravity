import { Random } from "./random.js";

class Vector {
	constructor(x = 0, y = x) {
		this._x = x;
		this._y = y;

		return this;
	}

	// constant alt constructors

	static zero() { return new Vector(0, 0); }
	static one() { return new Vector(1, 1); }

	static up() { return new Vector(0, -1); }
	static down() { return new Vector(0, 1); }
	static left() { return new Vector(-1, 0); }
	static right() { return new Vector(1, 0); }

	// alt constructors

	static fromAngle(angle) {
		return new Vector(Math.cos(angle), Math.sin(angle)); 
	}

	static random(minX, maxX, minY, maxY) {
		return new Vector(
			Random.float(minX, maxX),
			Random.float(minY, maxY)
		);
	}

	// static operations

	static add(v1, v2) { return new Vector(v1._x + v2._x, v1._y + v2._y); }
	static sub(v1, v2) { return new Vector(v1._x - v2._x, v1._y - v2._y); }
	static mult(v, n) { return new Vector(v._x * n, v._y * n); }
	static div(v, n) { return new Vector(v._x / n, v._y / n); }

	// object operations

	add(v) {
		this._x += v._x;
		this._y += v._y;

		return this;
	}

	sub(v) {
		this._x -= v._x;
		this._y -= v._y;

		return this;
	}

	mult(n) {
		this._x *= n;
		this._y *= n;

		return this;
	}

	div(n) {
		this._x /= n;
		this._y /= n;

		return this;
	}

	// simple operators

	get x() { return this._x; } 
	get y() { return this._y; }

	set x(n) { return this._x = x; }
	set y(n) { return this._y = y; }

	// methods

	normalize() {
		return this.div(this.length);
	}

	toString() {
		return `(${this._x}, ${this._y})`;
	}

	// properties

	get length() {
		return Math.hypot(this._x, this._y);
	}

	get lengthSquared() {
		return this._x * this._x + this._y * this._y;
	}

	get normal() {
		return Vector.div(this, this.length);
	}
}

export { Vector };