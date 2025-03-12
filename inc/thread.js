// 0 xPos
// 1 yPos
// 2 xVel
// 3 yVel
// 4 mass

self.onmessage = function(event) {
	console.log("something happened");
	
	const { data, count, components, dt, g } = event.data;
	const newData = new Float32Array(data.length);

	for (let i = 0; i < count; i++) {
		const d = i * components;
		const m1 = data[d + 4];
	
		for (let j = i + 1; j < count; j++) {
			const e = j * components;
			const m2 = newData[e + 4];
	
			const dx = newData[d + 0] - newData[e + 0];
			const dy = newData[d + 1] - newData[e + 1];
	
			let rSquared = dx * dx + dy * dy;
	
			// Avoid division by zero or very small distances
			const minDistanceSquared = 0.01 * 0.01;
			rSquared = Math.max(rSquared, minDistanceSquared);
	
			// Inverse distance and inverse rSquared
			const invRSquared = 1 / rSquared;
			const invR = 1 / Math.sqrt(rSquared);
	
			// Gravitational force magnitude
			const f = g * m1 * m2 * invRSquared;
	
			// Force components scaled without full normalization
			const fx = f * dx * invR;
			const fy = f * dy * invR;
	
			// Update velocities scaled by dt
			newData[d + 2] -= (fx / m1) * dt;
			newData[d + 3] -= (fy / m1) * dt;
	
			newData[e + 2] += (fx / m2) * dt;
			newData[e + 3] += (fy / m2) * dt;
		}
	
		// Update positions with velocities scaled by dt
		newData[d + 0] += newData[d + 2] * dt;
		newData[d + 1] += newData[d + 3] * dt;
	}

	self.postMessage("test");
}