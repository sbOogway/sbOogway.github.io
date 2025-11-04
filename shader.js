/* ---------- 1. Get a WebGL2 context ---------- */
const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl2");
if (!gl) {
  alert("WebGL2 not supported");
}

/* ---------- 2. Resize handling ---------- */
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(canvas.clientWidth * dpr);
  canvas.height = Math.floor(canvas.clientHeight * dpr);
  gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* ---------- 3. Vertex shader (simple pass‑through) ---------- */
const vertexSrc = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPosition;
out vec2 vUV;
void main() {
vUV = aPosition * 0.5 + 0.5;          // map [-1,1] → [0,1]
gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

/* ---------- 4. Fragment shader (your code) ---------- */
const fragmentSrc = `#version 300 es
precision highp float;
out vec4 fragColor;
in vec2 vUV;

uniform vec2 iResolution;
uniform float iTime;

#define FREQUENCY 999.
#define THICKNESS 0.01
#define Y_SHIFT 0.5
#define AMPLITUDE 0.45
#define SPEED 0.5

#define PI 3.141592653589793
#define BLACK vec3(0.,0.,0.)
#define RED   vec3(1.,0.,0.)
#define GREEN vec3(0.,1.,0.)
#define BLUE  vec3(0.,0.,1.)

float boundarySine(float x, float minimum, float maximum) {
float half_ = minimum + maximum / 2.;
return sin(x * 0.01) * half_ + half_ + minimum;
}

vec3 drawSine(vec2 uv, vec3 color, float phase) {
float sine = sin(uv.y * FREQUENCY + iTime * SPEED + phase) * AMPLITUDE + Y_SHIFT;
bool isSineUpper = uv.x <= (sine + THICKNESS);
bool isSineLower = uv.x >= (sine - THICKNESS);
return (isSineUpper && isSineLower) ? color : BLACK;
}

void main() {
vec2 uv = vUV;                     // already normalized [0,1]
vec3 col = vec3(0.0);
col += drawSine(uv, RED,   0.0);
col += drawSine(uv, GREEN, 2.0/3.0 * PI);
col += drawSine(uv, BLUE,  4.0/3.0 * PI);
fragColor = vec4(col, 1.0);
}`;

/* ---------- 5. Shader compilation helpers ---------- */
function compileShader(src, type) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/* ---------- 6. Build program ---------- */
const vert = compileShader(vertexSrc, gl.VERTEX_SHADER);
const frag = compileShader(fragmentSrc, gl.FRAGMENT_SHADER);
const program = gl.createProgram();
gl.attachShader(program, vert);
gl.attachShader(program, frag);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error("Program link error:", gl.getProgramInfoLog(program));
}

/* ---------- 7. Full‑screen quad geometry ---------- */
const quadVerts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);
gl.enableVertexAttribArray(0); // location = 0 in vertex shader
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

gl.bindVertexArray(null);

/* ---------- 8. Uniform locations ---------- */
const uniResolution = gl.getUniformLocation(program, "iResolution");
const uniTime = gl.getUniformLocation(program, "iTime");

/* ---------- 9. Render loop ---------- */
let start = performance.now();
function render(now) {
  const elapsed = (now - start) * 0.001; // seconds
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.uniform2f(uniResolution, canvas.width, canvas.height);
  gl.uniform1f(uniTime, elapsed);

  gl.bindVertexArray(vao);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.bindVertexArray(null);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
