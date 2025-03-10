import { Render } from "../inc/render.js";

const canvas = document.getElementById("canvas");
const render = new Render(canvas);

function updateRender() {
	render.resize(window.innerWidth, window.innerHeight);
}

updateRender();

window.addEventListener("resize", updateRender);