import { Particle } from "../inc/particle.js";
import { Vector } from "../inc/vector.js";
import "./initialize.js";

function updateParticles() {
	for (let i = 0; i < Particle.particles.length; i++) {
		const p1 = Particle.particles[i];

		p1.position.add(p1.velocity);

		for (let j = i + 1; j < Particle.particles.length; j++) {
			const p2 = Particle.particles[j];

			const direction = Vector.sub(p1.position, p2.position);
			const distanceSquared = direction.lengthSquared;

			if (distanceSquared > 100) {
				const force = p1.mass * p2.mass / distanceSquared;
				const directionNormal = direction.normalize();

				const forceDirection = Vector.mult(directionNormal, force / 100);

				p1.velocity.sub(forceDirection);
				p2.velocity.add(forceDirection);
			}
		}
	}

	// update

	window.requestAnimationFrame(updateParticles);
}

window.requestAnimationFrame(updateParticles);