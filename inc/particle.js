class Particle {
	static particles = [];

	constructor(mass, position, velocity) {
		this.mass = mass;
		this.position = position;
		this.velocity = velocity;
		
		this.radius = Math.sqrt(mass);

		Particle.particles.push(this);
	}
}

export { Particle };