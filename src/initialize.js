import { Random } from "../inc/random.js";
import { Vector } from "../inc/vector.js";
import { Particle } from "../inc/particle.js";

const particles = 1000;

for (let i = 0; i < particles; i++) {
	const mass = Random.int(1, 25);

	// get random position

	const theta = Math.random() * Math.PI * 2;
	const r = Math.min(window.innerWidth, window.innerHeight) / 2 * Math.random();

	const position = new Vector(r * Math.cos(theta), r * Math.sin(theta));
	position.add(new Vector(window.innerWidth / 2, window.innerHeight / 2));

	// get velocity from position

	const direction = Math.atan2(position.y - window.innerHeight / 2, position.x - window.innerWidth / 2);
	const velocity = Vector.fromAngle(direction + Math.PI / 2).mult(2);

	// create particle

	new Particle(mass, position, velocity);
}