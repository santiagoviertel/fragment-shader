// Author: Santiago Viertel
// Title: Phong reflection model with orthographic projection

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// Camera position
vec3 CP = vec3(0.5*u_resolution[0], 0.5*u_resolution[1], 0.0);

// Sphere attributes
// Position
vec3 SP = vec3(0.5*u_resolution[0], 0.5*u_resolution[1], -1.0*u_resolution[1]);
// Radius
float SR = 80.0;

// Sphere material: emerald
// Ambient
vec4 SMAM = vec4(0.0215, 0.1745, 0.0215, 0.55);
// Diffuse
vec4 SMDI = vec4(0.07568, 0.61424, 0.07568, 0.55);
// Specular
vec4 SMSP = vec4(0.633, 0.727811, 0.633, 0.55);
// Shininess
float SMSH = 76.8;

// Lights
// Ambient
float LA = 1.0;
// Point light 1
// Position
vec3 LPP = SP + vec3(2.0*SR*sin(u_time), 0.4*u_resolution[1], 2.0*SR*cos(u_time));
// Diffuse
vec4 LPDI = vec4(1.0, 1.0, 1.0, 1.0);
// Specular
vec4 LPSP = vec4(1.0, 1.0, 1.0, 1.0);

vec4 ball() {
	vec4 color = vec4(0.0);
	vec2 dist = gl_FragCoord.xy - vec2(SP[0], SP[1]);
	float square_distance = dist[0]*dist[0] + dist[1]*dist[1];
	if(square_distance<SR*SR) {
		// Ambient component
		color += SMAM*LA;
		// Diffuse component
		float sinAngX = dist[1]/SR;
		float cosAngX = sqrt(1.0 - sinAngX*sinAngX);
		float cosAngY = dist[0]/SR;
		float sinAngY = sqrt(1.0 - cosAngY*cosAngY);
		vec3 normal = vec3(cosAngX*cosAngY, sinAngX, -cosAngX*sinAngY);
		vec3 point = SP + normal*SR;
		vec3 light = normalize(LPP - point);
		color += SMDI*max(dot(light,normal), 0.0)*LPDI;
		// Specular component
		vec3 reflect = normalize(2.0*dot(-light,normal)*normal + light);
		vec3 viewer = normalize(CP - point);
		color += SMSP*pow(max(dot(reflect,viewer), 0.0),SMSH)*LPSP;
	}

	if(int(gl_FragCoord[0])==int(LPP[0]) && int(gl_FragCoord[1])==int(LPP[1]))
		color = vec4(1.0);
	return color;
}

void main() {
	vec4 color = vec4(0.0);

	color += ball();
	gl_FragColor = min(color,1.0);
}