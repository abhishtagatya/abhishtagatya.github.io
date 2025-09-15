---
title: "Making Batik in GLSL"
date: 2025-03-02T00:00:00+01:00
draft: false
description: "Experiment on Visualizing Indonesian Culture Programmatically"
tags: ["GLSL Programming", "Rendering", "Shaders"]
categories: ["Experiment"]
lightbox:
  enabled: true
justified_gallery:
  enabled: true
cover: "demo.gif"
---

![](demo.gif "Preview (https://www.shadertoy.com/view/3csXW4)")

### Introduction

This project explores the generative expression of **Batik**, a traditional Indonesian textile art, through GLSL shaders. By using noise functions, trigonometric patterns, and domain warping, the shader recreates floral and geometric motifs that resemble Batik designs in a dynamic, procedural form.  

### Technical Approach  

1. **Base Functions**  
   - A **rotation matrix** (`rmatrix`) and **hash-based noise** (`hash12`) provide randomized yet structured variations in the patterns.  
   - **Fractal Brownian Motion (fbm)** adds roughness and organic texture to avoid flat, uniform surfaces.
   - The movement paired with the noise creates the illusion of rough texture similarly found in Cloth.

2. **Motifs and Patterns**
   - `pattern()` generates repeating sinusoidal motifs, forming floral-like tessellations. 
   - `trigFlower()` uses polar coordinates and trigonometric modulation to create radial flower-like forms, echoing Batik’s botanical elements.
   - Batik Floral pattern mimics the style of [Sekar Jagad](https://en.wikipedia.org/wiki/Batik), but less abstracted.

3. **Color Palettes**  
   - `batikBgTex()` blends deep indigos, warm browns, and creamy yellows—colors historically used in Batik dyeing.  
   - `batikMaskTex()` introduces contrasting highlights, reminiscent of **wax-resist dyeing**, where wax masks create sharp, layered contrasts.

4. **Dynamic Motion**  
   - Subtle rotation (`rmatrix`) and animated offsets ensure that the patterns feel alive, much like the rhythmic flow of Batik-making as wax and dye interact over cloth.
   - Trying to visualize the relaxing and repetitive nature of creating Batik but also capturing the intricacy.

### Cultural Significance  

Batik is not only an art form but also a **cultural heritage recognized by UNESCO**. By translating Batik patterns into **real-time shader code**, this project shows how computational art can act as a new medium of cultural expression.  

Unlike static fabric, the shader captures Batik’s spirit in a **living, digital canvas**—patterns morph, colors shift, and textures evolve over time. This generative approach pays homage to Batik’s philosophy: balance between structure and improvisation, symmetry and imperfection.  

### Conclusion  

This shader is more than a technical exercise—it’s an experiment in preserving and reimagining **traditional art forms** in the context of digital media. By embedding Batik’s motifs into GLSL, it bridges the past and future, celebrating cultural identity through computational creativity.

```glsl
mat2 rmatrix(float a)
{
	float c = cos(a);
	float s = sin(a);

	return mat2(c, -s, s, c);
}

float hash12(vec2 uv) {
    return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

float fbm(vec2 uv) {
    float value = 0.0;
    float scale = 0.5;
    for (int i = 0; i < 5; i++) {
        value += scale * hash12(uv);
        uv *= 2.0;
        scale *= 0.5;
    }
    return value;
}

float pattern(vec2 uv, float sz, float pts) {
    uv *= sz;
    uv += vec2(sin(uv.y * 3.0 + iTime * 0.4) * 0.3, cos(uv.x * 3.0 + iTime * 0.4) * 0.3);
    float petal = sin(uv.x * pts) * cos(uv.y * pts);
    return smoothstep(0.2, 0.6, petal);
}

float trigFlower(vec2 uv, float petals) {
    return 1.0 - smoothstep(cos(atan(uv.y, uv.x) * petals) * 0.1 + 0.25, 
                             cos(atan(uv.y, uv.x) * petals) * 0.1 + 0.25 + 0.05, 
                             length(uv));
}

                              
vec3 batikBgTex(vec2 uv, float cn) {

    vec3 colors[4] = vec3[4]( vec3(0.011, 0.019, 0.062),
                              vec3(0.847, 0.556, 0.188),
                              vec3(0.996, 1.0, 0.780),
                              vec3(0.752, 0.376, 0.054)
                              );
                              
    float pt6 = pattern(uv, 8.0, 6.0); // Base Pattern
    float pt5 = pattern(uv, 4.0, 5.0); // Floral Pattern
    float pt52 = pattern(uv, 4.1, 5.0);
    
    vec3 col = mix(colors[0], colors[1], pt6 + cn * 0.5);
    
    if (pt52 >= 0.99) {
        col = mix(colors[0], colors[3], pt52 + cn * 0.2);
    }
    
    if (pt5 >= 0.99) {
        col = mix(colors[0], colors[2], pt5 + cn * 0.2);
    }
    
    return col;
}

vec3 batikMaskTex(vec2 uv, float cn) {

    vec3 colors[2] = vec3[2]( vec3(1.0, 0.019, 0.062),
                              vec3(0.847, 0.847, 0.847)
                              );
                              
    float pt6 = pattern(uv, 4.0, 12.0); // Base Pattern
    
    vec3 col = mix(colors[0], colors[1], pt6 + cn * 0.5);
    
    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    vec2 uvn = (fragCoord.xy - iResolution.xy * 0.5) / iResolution.y;
    float cn = fbm(uvn * 16.0); // Fixed noise for Rough Texture

    uv *= rmatrix(sin(iTime / 16.0) * 0.5);
    uv = abs(fract(uv * 2.0) - 0.5);
    
    float tf = trigFlower(uvn * rmatrix(-iTime / 16.0), 5.0);
    vec3 bgt = (tf < 0.9) ? batikBgTex(uv, cn) : batikMaskTex(uv, cn);

    // Output to screen
    fragColor = vec4(vec3(bgt),1.0);
}
```