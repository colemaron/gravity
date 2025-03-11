import { System } from "../inc/system.js";
import { Render } from "../inc/render.js";

// init rendering

const canvas = document.getElementById("webgl-canvas");
const render = new Render(canvas);

// init physics

const system = new System(10);

// main loop

function update() {
	system.draw(render);

	requestAnimationFrame(update);

	console.log("updated");
}

update();