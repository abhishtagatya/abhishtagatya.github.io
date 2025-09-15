---
title: "Making Procedural Clouds using Stacked Perlin in GLSL"
date: 2025-04-05T00:00:00+01:00
draft: false
description: "Procedural 2D Clouds with Noise"
tags: ["GLSL Programming", "Rendering", "Shaders"]
categories: ["Experiment"]
lightbox:
  enabled: true
justified_gallery:
  enabled: true
cover: "demo.gif"
---

![](demo.gif "Preview (https://www.shadertoy.com/view/W3BGRm)")

### Introduction

This shader creates a **dynamic sky with drifting clouds** using **Perlin noise** and layered blending techniques. Instead of relying on bitmap textures, it generates everything procedurally, making it scalable and resolution-independent.

### How It Works

#### 1. Base Colors
- **Sky:** a soft blue gradient (`vec3(0.4, 0.70, 0.9)`).
- **Clouds:** pure white (`vec3(1.0)`).

#### 2. Noise Functions
- `hash(vec2 p)` generates pseudo-random gradients.
- `perlin(vec2 p)` implements smooth Perlin noise interpolation.
- These form the foundation of the cloud shapes.

#### 3. Layered Perlin Noise
`stackedWavedPerlin` stacks 8 octaves of Perlin noise:
- Each octave doubles frequency and halves amplitude (fBm).
- Offset samples (`+0.1`, `-0.1`) create a **wave-like drift**.
- Animation is driven by `iTime`, simulating cloud movement.

#### 4. Sky Gradient and Blending
The shader mixes noise with a vertical blue gradient:
- `smoothstep` layers soften cloud edges.
- Multiple blends simulate **light scattering** inside clouds.
- Results in natural-looking, soft formations.

#### 5. Final Composition
The sky texture is sampled at different scales (`uv * 4.0`, `uv * 2.0`), then combined to add **extra detail**.

#### Conclusion
- **Procedural:** No image textures needed.
- **Dynamic:** Clouds move and evolve over time.
- **Stylized Realism:** Smooth, layered blending mimics atmospheric scattering.

This approach is widely used in **games, simulations, and generative art** to produce skies that feel alive without heavy assets.

```glsl
vec3 SKY_COLOR = vec3(0.4, 0.70, 0.9);
vec3 CLOUDS_COLOR = vec3(1.0);

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float perlin(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                   dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
               mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                   dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

float stackedWavedPerlin(vec2 uv) {
    float n = 0.0;
    float amp = 1.0;
    float freq = 1.0;
    
    for (int i = 0; i < 8; i++) {
        n += perlin(uv * freq + iTime * freq * 0.1) * amp;
        n += perlin(uv + 0.1 * freq + iTime * freq * 0.1) * amp * 0.25;
        n += perlin(uv - 0.1 * freq + iTime * freq * 0.1) * amp * 0.25;

        freq *= 2.0;
        amp *= 0.5;
    }
    
    return n;
}

// Please let me know how I can improve the `skyTexture`
vec3 skyTexture(vec2 uv) {    
    float m = stackedWavedPerlin(uv);
    
    vec3 gradientSky = mix(SKY_COLOR * 0.95, SKY_COLOR, uv.y);

    vec3 c1 = mix(gradientSky, CLOUDS_COLOR, smoothstep(0.0, 0.5, m * 2.5));
    vec3 c2 = mix(c1, CLOUDS_COLOR / 1.05, smoothstep(0.0, 1.25, m * 2.));
    vec3 c3 = mix(c2, CLOUDS_COLOR / 1.2, smoothstep(0.0, 1.5, m * 1.5));
    vec3 c4 = mix(c3, CLOUDS_COLOR / 1.75, smoothstep(0.0, 2.5, m));
    
    return c4;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {    
    vec2 uv = fragCoord / iResolution.y;

    vec3 t = skyTexture(uv * 4.);
    t += skyTexture(uv * 2.) * 0.1;
    
    fragColor = vec4(t, 1.);
}
```