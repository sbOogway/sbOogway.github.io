(function(){const c=document.createElement("link").relList;if(c&&c.supports&&c.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))l(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function i(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function l(r){if(r.ep)return;r.ep=!0;const o=i(r);fetch(r.href,o)}})();const d=document.getElementById("home-btn");window.addEventListener("scroll",()=>{h()});const h=()=>{document.body.scrollTop>20||document.documentElement.scrollTop>20?d.classList.add("show"):d.classList.remove("show")},t=document.getElementById("glcanvas"),e=t.getContext("webgl2");e||alert("WebGL2 not supported");function f(){const a=window.devicePixelRatio||1;t.width=Math.floor(t.clientWidth*a),t.height=Math.floor(t.clientHeight*a),e.viewport(0,0,t.width,t.height)}window.addEventListener("resize",f);f();const g=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aPosition;
out vec2 vUV;
void main() {
vUV = aPosition * 0.5 + 0.5;          // map [-1,1] → [0,1]
gl_Position = vec4(aPosition, 0.0, 1.0);
}`,S=`#version 300 es
precision highp float;
out vec4 fragColor;
in vec2 vUV;

uniform vec2 iResolution;
uniform float iTime;

#define FREQUENCY 9.
#define THICKNESS 0.1
#define Y_SHIFT 0.5
#define AMPLITUDE 0.45
#define SPEED .5

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
}`;function u(a,c){const i=e.createShader(c);return e.shaderSource(i,a),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS)?i:(console.error("Shader compile error:",e.getShaderInfoLog(i)),e.deleteShader(i),null)}const p=u(g,e.VERTEX_SHADER),E=u(S,e.FRAGMENT_SHADER),n=e.createProgram();e.attachShader(n,p);e.attachShader(n,E);e.linkProgram(n);e.getProgramParameter(n,e.LINK_STATUS)||console.error("Program link error:",e.getProgramInfoLog(n));const A=new Float32Array([-1,-1,1,-1,-1,1,1,1]),m=e.createVertexArray();e.bindVertexArray(m);const L=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,L);e.bufferData(e.ARRAY_BUFFER,A,e.STATIC_DRAW);e.enableVertexAttribArray(0);e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);e.bindVertexArray(null);const P=e.getUniformLocation(n,"iResolution"),y=e.getUniformLocation(n,"iTime");let R=performance.now();function v(a){const c=(a-R)*.001;e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),e.useProgram(n),e.uniform2f(P,t.width,t.height),e.uniform1f(y,c),e.bindVertexArray(m),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.bindVertexArray(null),requestAnimationFrame(v)}requestAnimationFrame(v);
