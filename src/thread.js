import { System } from "../inc/system.js";

// 0 xPos
// 1 yPos
// 2 xVel
// 3 yVel
// 4 radius

self.onmessage = function(event) {
	const { buffer, count } = event.data;
	const particles = new Float32Array(buffer);

	for (let i = 0; i < count; i++) {
		d = i * System.components;

		// update pos with vel

		particles[d + 0] += particles[d + 2];
		particles[d + 1] += particles[d + 3];

		// make velocity random

		particles[d + 2] = Math.random() - 0.5;
		particles[d + 3] = Math.random() - 0.5;
	}
}