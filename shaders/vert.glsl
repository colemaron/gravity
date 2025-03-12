#version 300 es
precision lowp float;

in vec2 particlePosition;
in vec2 vertexPosition;
in float mass;

out vec2 io_vertexPosition;
out float io_radius;
out float io_halfRadius;

uniform vec2 resolution;

void main() {
	float radius = sqrt(mass);

	vec2 scaled = (vertexPosition * radius * 2.0) + particlePosition;
	vec2 clip = scaled / resolution * 2.0 - 1.0;

	gl_Position = vec4(clip, 0.0, 1.0);

	io_vertexPosition = vertexPosition;
	io_radius = radius;
	io_halfRadius = radius / 2.0;
}