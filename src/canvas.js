import { Particle } from "../inc/particle.js";
import { Clock } from "../inc/clock.js";

// initialize canvas

const fontSize = 12;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d", {
	alpha: false,
});

ctx.imageSmoothingEnabled = false;

function resizeCanvas() {
	const save = ctx.getImageData(0, 0, canvas.width, canvas.height);

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	ctx.putImageData(save, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// draw frames

const clock = new Clock();

function drawAllParticles() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// draw particles

	for (const particle of Particle.particles) {
		ctx.beginPath();
		ctx.arc(particle.position.x, particle.position.y, particle.radius, 0, Math.PI * 2);
		ctx.fill();
	}

	// update data

	const dt = clock.tick();
	const fps = 1000 / dt;

	// draw data

	Object.entries({
		FPS: fps.toFixed(2),
		Particles: Particle.particles.length,
	}).forEach(([key, value], i) => {
		ctx.fillStyle = "white";
		ctx.font = `${fontSize}px monospace`;

		ctx.fillText(`${key}: ${value}`, 0, i * fontSize + fontSize);
	});

	// new frame

	window.requestAnimationFrame(drawAllParticles);
}

window.requestAnimationFrame(drawAllParticles);