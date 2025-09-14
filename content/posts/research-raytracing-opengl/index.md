---
title: "Sphere Ray Tracing in OpenGL"
date: 2025-01-28T00:00:00+01:00
draft: false
description: "Experiment on Ray Tracing using Sphere Geometry"
tags: ["OpenGL", "C++ Programming", "Rendering"]
categories: ["Experiment"]
lightbox:
  enabled: true
justified_gallery:
  enabled: true
cover: "demo.gif"
---

![](demo.gif "Preview")

### Introduction

This project demonstrates **ray tracing and particle simulation** using OpenGL. The scene combines static models, dynamic lights, and particle effects to showcase soft shadows, ambient occlusion, and real-time simulation.  

### Approach  

The scene is built using a hybrid pipeline:  

1. **Ray Tracing**  
   - Static snowman model and dynamic light spheres are ray-traced.  
   - Soft shadows are computed using adjustable **sample count** and **light radius**.  
   - **Spherical Ambient Occlusion** enhances depth perception and realism.  
   - Early exit optimization is applied to rays with low attenuation for better performance.  

2. **Particle Simulation**  
   - Particles are rasterized while their motion is computed in the **vertex shader**.  
   - Dissolving and decay effects are implemented in **geometry** and **fragment shaders**.  
   - Simulation parameters such as particle count and size are configurable at runtime.  

3. **Combination**  
   - Ray-traced scene and particle simulation are combined for the final output.  
   - Adjustable effects allow balancing visual quality and performance.  

### Performance  

Tested on: **Intel Core i5-1335U, Intel Iris Xe Graphics, 16GB RAM**  

| Scene | FPS (CPU–GPU) |
|-------|---------------|
| Ray Tracing Basic* | 14–16 |
| w/ Max Particle Simulation | 13–14 |
| w/ Max Shadow Sample | 2–3 |
| w/ Max Ambient Occlusion | 2–2.5 |

*Basic configuration: 3–100 reflections, 16 shadow samples, 16 ambient occlusion samples, 4096 particles  

### Conclusion  

This project demonstrates a **real-time hybrid rendering approach**, combining ray tracing for realistic lighting and shadows with GPU-accelerated particle simulations. Optimizations like early exit and adjustable sampling make it feasible on mid-range hardware while maintaining high visual fidelity.  

