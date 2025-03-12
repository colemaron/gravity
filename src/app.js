import { System } from "../inc/system.js";

// init rendering

const canvas = document.getElementById("webgl-canvas");

// init physics

const system = new System(100, canvas);

// window resize

function resize() {
	system.render.resize(canvas.width, canvas.height);
}

window.addEventListener("resize", resize);

resize();

// fill system data

system.init();

// main loop

function update() {
	system.physics();
	system.draw();

	console.log("UPDATING...");

	// requestAnimationFrame(update);
}

update();