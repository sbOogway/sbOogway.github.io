(function(){const c=document.createElement("link").relList;if(c&&c.supports&&c.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))l(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function i(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function l(o){if(o.ep)return;o.ep=!0;const r=i(o);fetch(o.href,r)}})();function h(){document.querySelector("nav").classList.toggle("show")}const d=document.getElementById("home-btn");window.addEventListener("scroll",()=>{u()});const u=()=>{document.body.scrollTop>20||document.documentElement.scrollTop>20?d.classList.add("show"):d.classList.remove("show")},S=()=>{document.body.scrollTop=0,document.documentElement.scrollTop=0};window.toggleNavbar=h;window.topScroll=S;window.scrollFunction=u;const t=document.getElementById("glcanvas"),e=t.getContext("webgl2");e||alert("WebGL2 not supported");function f(){const n=window.devicePixelRatio||1;t.width=Math.floor(t.clientWidth*n),t.height=Math.floor(t.clientHeight*n),e.viewport(0,0,t.width,t.height)}window.addEventListener("resize",f);f();const p=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aPosition;
out vec2 vUV;
void main() {
vUV = aPosition * 0.5 + 0.5;          // map [-1,1] → [0,1]
gl_Position = vec4(aPosition, 0.0, 1.0);
}`,E=`#version 300 es
precision highp float;
out vec4 fragColor;
in vec2 vUV;

uniform vec2 iResolution;
uniform float iTime;

#define FREQUENCY 99999.
#define THICKNESS 0.5
#define Y_SHIFT 0.0
#define AMPLITUDE 0.5
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
}`;function m(n,c){const i=e.createShader(c);return e.shaderSource(i,n),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS)?i:(console.error("Shader compile error:",e.getShaderInfoLog(i)),e.deleteShader(i),null)}const w=m(p,e.VERTEX_SHADER),A=m(E,e.FRAGMENT_SHADER),a=e.createProgram();e.attachShader(a,w);e.attachShader(a,A);e.linkProgram(a);e.getProgramParameter(a,e.LINK_STATUS)||console.error("Program link error:",e.getProgramInfoLog(a));const y=new Float32Array([-1,-1,1,-1,-1,1,1,1]),v=e.createVertexArray();e.bindVertexArray(v);const L=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,L);e.bufferData(e.ARRAY_BUFFER,y,e.STATIC_DRAW);e.enableVertexAttribArray(0);e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);e.bindVertexArray(null);const P=e.getUniformLocation(a,"iResolution"),T=e.getUniformLocation(a,"iTime");let R=performance.now();function g(n){const c=(n-R)*.001;e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),e.useProgram(a),e.uniform2f(P,t.width,t.height),e.uniform1f(T,c),e.bindVertexArray(v),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.bindVertexArray(null),requestAnimationFrame(g)}requestAnimationFrame(g);
