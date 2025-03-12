#version 300 es
precision lowp float;

in vec2 io_vertexPosition;
in float io_radius;
in float io_halfRadius;

out vec4 fragColor;

void main() {
	float d = length(io_vertexPosition * io_radius);

	float alpha = 1.0 - smoothstep(io_halfRadius - 1.0, io_halfRadius, d);

	fragColor = vec4(vec3(1.0), alpha);
}