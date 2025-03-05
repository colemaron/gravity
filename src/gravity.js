import { Particle } from "../inc/particle.js";
import { Vector } from "../inc/vector.js";
import "./initialize.js";

const threads = navigator.hardwareConcurrency;

const workers = [];
let completed = 0;

function chunkArray(array, threads) {
	const chunks = [];
	const chunkSize = Math.ceil(array.length / threads);

	for (let i = 0; i < array.length; i += chunkSize) {
		chunks.push(array.slice(i, i + chunkSize));
	}

	return chunks;
}

function updateParticles() {
	const chunks = chunkArray(Particle.particles, threads);

	workers.forEach(worker => worker.terminate());
	completed = 0;

	for (const chunk of chunks) {
		const worker = new Worker("./worker.js");

		worker.postMessage({ particles: chunk });

		worker.onmessage = () => {
			completed++;

			if (completedWorkers === chunks.length) {
				console.log("done");
			}
		}

		worker.onerror = function(err) {
			console.error("Worker error:", err);
		};

		workers.push(worker);
	}

	// update

	// window.requestAnimationFrame(updateParticles);
}

updateParticles();

// window.requestAnimationFrame(updateParticles);